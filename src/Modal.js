import ReactModal from "react-modal";
import { useNavigate } from "react-router-dom";
import { hangmanImages } from "./images";
import "./ModalComponent.css";
import "./fonts.css";

ReactModal.setAppElement("#root");

function decodeWord(encodedWord) {
    // Simple Caesar cipher with shift of 1
    return encodedWord
      .split("")
      .map((char) => String.fromCharCode(char.charCodeAt(0) - 1))
      .join("");
  }

const Modal = ({
  isOpen,
  onRequestClose,
  sessionID,
  status,
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
        Round: 1
      </div>
      <div className="word-text">
        Word: <span className="word-name">{decodeWord(sessionID)}</span>
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
      <p className="modal-text">Total Score: Log In To Get A Score</p>
      <div className="button-container">
            <button
              type="button"
              className="modal-button leave"
              onClick={handleLeave}
            >
              Leave
            </button>
      </div>
    </ReactModal>
  );
};

export default Modal;