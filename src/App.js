import React, { useState, useEffect } from "react";
import { addUser, getScores, setCurrentUser } from "./firebase.js";
import { Routes, Route, useNavigate } from "react-router-dom";
import Hangman from "./Hangman.js";
import { hangmanImages } from "./images";
import "./App.css";
import SingleSession from "./SingleSession.js";

const App = () => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [scores, setScores] = useState([]);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchScores = async () => {
      const scores = await getScores();
      setScores(scores);
    };
    fetchScores();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    // Check if the name field is empty
    if (name.trim() === "") {
      setNameError("ERROR: Name cannot be empty!");
      return;
    }
    addUser(name);
    setNameError("");
    setCurrentUser(name);
    navigate("/hangman");
  }

  function handleViewLeaderboard() {
    setShowLeaderboardModal(true);
  }

  function handleCloseLeaderboardModal() {
    setShowLeaderboardModal(false);
  }

  function handleViewRules() {
    setShowRulesModal(true);
  }

  function handleCloseRulesModal() {
    setShowRulesModal(false);
  }

  return (
    <div className="container">
      <Routes>
        <Route
          path="/"
          element={
            <form className="loginForm" onSubmit={handleSubmit}>
              <h1>Hangman Game Login</h1>
              <img className="lost-image" src={hangmanImages[0]} />
              <div className="form-control">
                <label htmlFor="name" className="text name">
                  Enter Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {nameError && <p className="error">{nameError}</p>}
              <button type="submit" className="btn-login">
                Login
              </button>
              <div className="btn-container">
                <button
                  type="button"
                  onClick={handleViewLeaderboard}
                  className="btn"
                >
                  View Leaderboard
                </button>
                <button type="button" onClick={handleViewRules} className="btn">
                  Rules
                </button>
              </div>
            </form>
          }
        />
        <Route path="/singlesession/:sessionID" element={<SingleSession />} />

        <Route
          path="/hangman"
          element={
            <>
              <Hangman />
            </>
          }
        />
      </Routes>
      {showLeaderboardModal && (
        <div className="modal-app">
          <div className="modal-content-app">
            <div className="modal-header-app">
              <h2>Leaderboard</h2>
              <button
                onClick={handleCloseLeaderboardModal}
                className="close-btn"
              >
                X
              </button>
            </div>
            <div className="leaderboard">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map((score, index) => (
                    <tr key={index}>
                      <td>{score.name}</td>
                      <td>{score.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {showRulesModal && (
        <div className="modal-app">
          <div className="modal-content-app">
            <div className="modal-header-app">
              <h2>Rules</h2>
              <button onClick={handleCloseRulesModal} className="close-btn">
                X
              </button>
            </div>
            <div className="rules">
              <h3>Scoring or point system for Hangman game:</h3>
              <ol>
                <li>
                  At the beginning of the game, the player is assigned 7 points
                  and 7 lives.
                </li>
                <li>
                  For each incorrect guess, one point and one life is deducted.
                </li>
                <li>
                  If the player guesses a letter that appears in the word, they
                  earn points equal to the number of occurrences of that letter
                  in the word.
                </li>
                <li>
                  If the player guesses the word correctly before running out of
                  points or lives, they win the round and receive a score equal
                  to the number of remaining points or lives.
                </li>
                <li>
                  If the player runs out of lives before guessing the word
                  correctly, they lose the round and receive a score of zero.
                </li>
                <li>
                  This game consists of 3 rounds. Each round will have one word.
                  The cumulative score of these three rounds will be saved after
                  the game ends.
                </li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;