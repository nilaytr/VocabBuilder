import { useEffect } from "react";
import ReactDOM from "react-dom";
import css from "./Modal.module.css";

const Modal = ({ children, isOpen, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Escape") {
                onClose();
            }
        };
        
        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        }
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);
    
    const handleBackDropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    if (!isOpen) return null;
    
    return ReactDOM.createPortal(
        <div className={css.modal} onClick={handleBackDropClick}>
            <div className={css.modalContent}>
                <button className={css.closeButton} onClick={onClose}>
                    <img src="/icons/x.svg" alt="close" />
                </button>
                {children}
            </div>
        </div>,
        document.getElementById("modal-root")
    );
};

export default Modal;