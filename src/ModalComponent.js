import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import { hangmanImages } from "./images";
import "./ModalComponent.css";
import "./fonts.css";

ReactModal.setAppElement("#root");

const ModalComponent = ({
  isOpen,
  onRequestClose,
  word,
  status,
  totalScore,
  round,
  roundsTotal,
  handleNextRound,
  handleReset,
}) => {
  const navigate = useNavigate();

  function handleLeave() {
    navigate("/");
    window.location.reload();
  }

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="round">
        Round: {round}/{roundsTotal}
      </div>
      <div className="word-text">
        word: <span className="word-name">{word}</span>
      </div>
      <div className="status">
        {status === "won" ? (
          <div className="won">You guessed it right!</div>
        ) : (
          <div>
            <img
              className="lost-image"
              src={hangmanImages[0]}
              alt={`Hangman - 0 lives left`}
            />
            <div className="lost">You guessed it wrong!</div>
          </div>
        )}
      </div>
      <p className="modal-text">Total Score: {totalScore}</p>
      <div className="button-container">
        {round < roundsTotal ? (
          <button
            type="button"
            className="modal-button"
            onClick={handleNextRound}
          >
            Next Round
          </button>
        ) : (
          <div className="button-container">
            <button
              type="button"
              className="modal-button"
              onClick={handleReset}
            >
              Play Again
            </button>
            <button
              type="button"
              className="modal-button leave"
              onClick={handleLeave}
            >
              Leave
            </button>
          </div>
        )}
      </div>
    </ReactModal>
  );
};

export default ModalComponent;