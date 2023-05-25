import React, { useState } from 'react';
import './Share.css';

function encodeWord(word) {
  // Simple Caesar cipher with shift of 1
  return word
    .split("")
    .map((char) => String.fromCharCode(char.charCodeAt(0) + 1))
    .join("");
}

function Share({ setShowShare }) {
  const [link, setLink] = useState('');
  const [word, setWord] = useState('');

  const generateLink = () => {
    const newLink = `https://akskola.github.io/hangman-game/#/singlesession/${encodeWord(word).toUpperCase()}`;
    setLink(newLink);
    navigator.clipboard.writeText(newLink);
  };

  const handleInputChange = (e) => {
    setWord(e.target.value);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={() => setShowShare(false)}>
          &times;
        </span>
        <div className="share-header">
          <h2>Share With Your Friends</h2>
        </div>
        <div className="link-container">
          <label htmlFor="link-input">Enter the Word:</label>
          <input id="link-input" type="text" value={word} onChange={handleInputChange} />
          {link && (
            <div className="generated-link-container">
              <label>Link:</label>
              <div className="generated-link"><a href={link} target="_blank" rel="noreferrer">{link}</a>

</div>
            </div>
          )}
        </div>
        <button className="generate-link-btn" onClick={generateLink}>
          Generate & Copy Link
        </button>
      </div>
    </div>
  );
}

export default Share;