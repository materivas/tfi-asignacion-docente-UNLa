import React, { useEffect, useCallback, useState } from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Modal: React.FC<ModalProps> = ({ children, onClose, title, size = "md" }) => {
  const [isVisible, setIsVisible] = useState(false);

  const sizeMap = {
    sm: "400px",
    md: "600px",
    lg: "800px",
    xl: "1000px",
  };

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 10);
    
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden"; // Prevenir scroll del body
    
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "unset";
    };
  }, [handleKey]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200); // Esperar animación de salida
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "var(--spacing-lg)",
    opacity: isVisible ? 1 : 0,
    transition: "opacity var(--transition-base)",
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: "var(--color-white)",
    borderRadius: "var(--border-radius-xl)",
    boxShadow: "var(--shadow-xl)",
    width: "100%",
    maxWidth: sizeMap[size],
    maxHeight: "90vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transform: isVisible ? "scale(1)" : "scale(0.95)",
    opacity: isVisible ? 1 : 0,
    transition: "all var(--transition-base)",
  };

  const headerStyle: React.CSSProperties = {
    padding: "var(--spacing-lg) var(--spacing-xl)",
    borderBottom: "1px solid var(--color-gray-200)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "var(--color-bg-tertiary)",
  };

  const titleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "var(--font-size-xl)",
    fontWeight: 600,
    color: "var(--color-gray-900)",
  };

  const closeButtonStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "var(--color-gray-500)",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "var(--border-radius-md)",
    transition: "all var(--transition-fast)",
  };

  const bodyStyle: React.CSSProperties = {
    padding: "var(--spacing-xl)",
    overflowY: "auto",
    flex: 1,
  };

  return (
    <div 
      style={overlayStyle} 
      onClick={handleClose}
      role="presentation"
    >
      <div
        style={modalStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div style={headerStyle}>
            <h2 id="modal-title" style={titleStyle}>
              {title}
            </h2>
            <button
              onClick={handleClose}
              style={closeButtonStyle}
              aria-label="Cerrar modal"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-gray-200)";
                e.currentTarget.style.color = "var(--color-gray-700)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-gray-500)";
              }}
            >
              ✕
            </button>
          </div>
        )}
        <div style={bodyStyle}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;