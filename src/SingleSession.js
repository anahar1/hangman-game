import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { hangmanImages } from "./images";
import "./Hangman.css";
import "./fonts.css";
import { useNavigate , useParams } from "react-router-dom";

function decodeWord(encodedWord) {
  // Simple Caesar cipher with shift of 1
  return encodedWord
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) - 1))
    .join("");
}


function SingleSession() {
  const { sessionID } = useParams();
  const { userName } = "USER";
  const navigate = useNavigate();
  const [hiddenWord, setHiddenWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [lives, setLives] = useState(7);
  const [score, setScore] = useState(lives);
  const [totalScore] = useState(0);
  const [status, setStatus] = useState("playing");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [letterColor, setLetterColor] = useState({});

  useEffect(() => {
    setHiddenWord(decodeWord(sessionID).replace(/\w/g, "_"));
    setScore(lives);
  }, [sessionID, lives]);

  const handleGuess = (letter) => {
    let isCorrect = decodeWord(sessionID).includes(letter);
    if (isCorrect) {
      const occurrences = (decodeWord(sessionID).match(new RegExp(letter, "g")) || []).length;
      setScore(score + occurrences);
    } else {
      setLives(lives - 1);
      setScore(score - 1);
    }
    setGuessedLetters([...guessedLetters, letter]);
    console.log("name:", userName);

    // set color of guessed letter
    let color = "";
    if (isCorrect) {
      color = "guessed-letter correct";
    } else {
      color = "guessed-letter wrong";
    }
    setLetterColor({ ...letterColor, [letter]: color });
  };

  const handleLogout = async () => {
    navigate("/");
  };
  

  useEffect(() => {
    const newHiddenWord = decodeWord(sessionID).replace(
      new RegExp(`[^${guessedLetters.join("")} ]`, "g"),
      "_ "
    );
    setHiddenWord(newHiddenWord);

    if (newHiddenWord === decodeWord(sessionID) && decodeWord(sessionID) !== "") {
      setStatus("won");
    } else if (lives === 0) {
      setStatus("lost");
    }
  }, [sessionID, guessedLetters, lives]);

  const handleLetterColor = (letter) => {
    if (guessedLetters.includes(letter)) {
      return letterColor[letter] || "";
    } else {
      return "";
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    if (status !== "playing") {
      setModalIsOpen(true);
    }
  }, [status]);

  return (
    <div className="hangman">
      <h1 className="hangman-title">PLAY HANGMAN</h1>
      <div className="scores-container">
        <div className="score">Score: {score}</div>
        <div className="total-score">Total Score: {totalScore}</div>
      </div>
      <img src={hangmanImages[lives]} alt={`Hangman - ${lives} lives left`} />
      <div className="word">{hiddenWord}</div>
      <div className="letters">
        {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(
          (letter) => (
            <button
              type="button"
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={
                guessedLetters.includes(letter) ||
                hiddenWord.includes(letter) ||
                status !== "playing"
              }
              className={handleLetterColor(letter)}
            >
              {letter}
            </button>
          )
        )}
      </div>
      <div className="button-container">
        <button onClick={() => handleLogout()}>Log In</button>
      </div>
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        sessionID={sessionID}
        status={status}
      />
    </div>
  );
}

export default SingleSession;

