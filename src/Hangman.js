import React, { useState, useEffect } from "react";
import ModalComponent from "./ModalComponent";
import { hangmanImages } from "./images";
import { setScores, getCurrentUser } from "./firebase";
import "./Hangman.css";
import "./fonts.css";
import Share from "./Share";
import { useNavigate } from "react-router-dom";

const words = [
  "APPLE",
  "BANANA",
  "CHERRY",
  "GRAPE",
  "LEMON",
  "ORANGE",
  "PEAR",
  "PINEAPPLE",
  "STRAWBERRY",
  "WATERMELON",
  "CARROT",
  "POTATO",
  "TOMATO",
  "BROCCOLI",
  "AVOCADO",
  "PEACH",
  "BLUEBERRY",
  "RASPBERRY",
  "BLACKBERRY",
  "KIWI",
  "MANGO",
  "PAPAYA",
  "CUCUMBER",
  "LETTUCE",
  "SPINACH",
  "BELLPEPPER",
  "MUSHROOM",
  "ONION",
  "GARLIC",
];


function Hangman() {
  const navigate = useNavigate();
  const [userName, setName] = useState("");
  const [word, setWord] = useState("");
  const [hiddenWord, setHiddenWord] = useState("");
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [lives, setLives] = useState(7);
  const [score, setScore] = useState(lives);
  const [totalScore, setTotalScore] = useState(0);
  const [status, setStatus] = useState("playing");
  const [round, setRound] = useState(1);
  const [roundsTotal] = useState(3); // Set total rounds here
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [letterColor, setLetterColor] = useState({});
  const [showShare, setShowShare] = useState(false);




  useEffect(() => {
    const fetchScore = async () => {
      const storedName = await getCurrentUser();
        if (storedName) {
          setName(storedName);
        }
    };
    fetchScore();
  }, [userName]);

  useEffect(() => {
    setWord(words[Math.floor(Math.random() * words.length)]);
  }, [round]);

  useEffect(() => {
    setHiddenWord(word.replace(/\w/g, "_"));
    setScore(lives);
  }, [word, lives]);

  const handleGuess = (letter) => {
    let isCorrect = word.includes(letter);
    if (isCorrect) {
      const occurrences = (word.match(new RegExp(letter, "g")) || []).length;
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
    const newHiddenWord = word.replace(
      new RegExp(`[^${guessedLetters.join("")} ]`, "g"),
      "_ "
    );
    setHiddenWord(newHiddenWord);

    if (newHiddenWord === word && word !== "") {
      setStatus("won");
      setTotalScore(totalScore + score);
    } else if (lives === 0) {
      setStatus("lost");
    }
  }, [word, guessedLetters, lives]);

  const handleReset = () => {
    setTotalScore(0);
    setRound(1);
    setWord(words[Math.floor(Math.random() * words.length)]);
    setHiddenWord("");
    setGuessedLetters([]);
    setLives(7);
    setStatus("playing");
    setModalIsOpen(false);
  };

  const handleNextRound = () => {
    setScores(userName, totalScore)
    setRound(round + 1);
    setWord(words[Math.floor(Math.random() * words.length)]);
    setHiddenWord("");
    setGuessedLetters([]);
    setLives(7);
    setStatus("playing");
    setModalIsOpen(false);
  };

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

  const handleShare = () => {
    setShowShare(true);
  };

  useEffect(() => {
    if (status !== "playing") {
      setModalIsOpen(true);
    }
  }, [status]);

  useEffect(() => {
    if (status !== "playing" && round === roundsTotal) {
      setScores(userName, totalScore);
    }
  }, [status, round, roundsTotal]);

  return (
    <div className="hangman">
      <h1 className="hangman-title">HANGMAN</h1>
      <div className="scores-container">
        <div className="score">Current Score: {score}</div>
        <div className="user-name">Username: {userName}</div>
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
        <button className="btn-action logout" onClick={() => handleLogout()}>Logout</button>
        <button className="btn-action share" onClick={() => handleShare()}>Share</button>
      </div>


      <p className="text">Round Status: {status.toUpperCase()}</p>
      {status === "playing" && (
        <div className="round text">
          Round: {round}/{roundsTotal}
        </div>
      )}

      {showShare && <Share setShowShare={setShowShare} />}
      
      <ModalComponent
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        word={word}
        status={status}
        totalScore={totalScore}
        round={round}
        roundsTotal={roundsTotal}
        handleNextRound={handleNextRound}
        handleReset={handleReset}
      />
    </div>
  );
}

export default Hangman;