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
    sm: "420px",
    md: "560px",
    lg: "760px",
    xl: "960px",
  };

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "unset";
    };
  }, [handleKey]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--spacing-lg)",
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onClick={handleClose}
      role="presentation"
    >
      <div
        style={{
          backgroundColor: "var(--color-white)",
          borderRadius: "var(--border-radius-xl)",
          boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.18)",
          width: "100%",
          maxWidth: sizeMap[size],
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transform: isVisible ? "scale(1) translateY(0)" : "scale(0.96) translateY(8px)",
          opacity: isVisible ? 1 : 0,
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          border: "1px solid var(--color-gray-200)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            style={{
              padding: "var(--spacing-lg) var(--spacing-xl)",
              borderBottom: "1px solid var(--color-gray-100)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--color-white)",
            }}
          >
            <h2
              id="modal-title"
              style={{
                margin: 0,
                fontSize: "var(--font-size-lg)",
                fontWeight: 700,
                color: "var(--color-primary)",
                letterSpacing: "-0.2px",
              }}
            >
              {title}
            </h2>
            <button
              onClick={handleClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--color-gray-400)",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--border-radius-md)",
                transition: "all var(--transition-fast)",
                fontSize: "1.25rem",
              }}
              aria-label="Cerrar modal"
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-gray-100)";
                e.currentTarget.style.color = "var(--color-gray-700)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-gray-400)";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        )}
        <div style={{ padding: "var(--spacing-xl)", overflowY: "auto", flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;