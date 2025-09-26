import React, { useEffect, useCallback } from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const modalEstilo: React.CSSProperties = {
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
  zIndex: 1000,
  width: "90%",
  maxWidth: "500px"
};

const overlayEstilo: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  zIndex: 999
};

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <>
      <div style={overlayEstilo} onClick={onClose} aria-hidden="true" />
      <div
        style={modalEstilo}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </>
  );
};

export default Modal;