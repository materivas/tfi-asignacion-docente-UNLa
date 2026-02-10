import { Link, useLocation } from "react-router-dom";
import type { FC } from "react";

const Navbar: FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    color: "var(--color-white)",
    textDecoration: "none",
    fontWeight: active ? "600" : "500",
    fontSize: "0.9375rem",
    padding: "0.625rem 1.25rem",
    borderRadius: "var(--border-radius-md)",
    backgroundColor: active ? "rgba(255, 255, 255, 0.15)" : "transparent",
    transition: "all var(--transition-base)",
    display: "inline-block",
    borderBottom: active ? "2px solid var(--color-white)" : "2px solid transparent",
  });

  return (
    <header
      style={{
        backgroundColor: "var(--color-primary)",
        boxShadow: "var(--shadow-md)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 0",
          }}
        >
          {/* Logo y Título */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "var(--color-white)",
                borderRadius: "var(--border-radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1.25rem",
                color: "var(--color-primary)",
              }}
            >
              UNLa
            </div>
            <div>
              <h1
                style={{
                  color: "var(--color-white)",
                  fontSize: "1.25rem",
                  fontWeight: "600",
                  margin: 0,
                  lineHeight: "1.2",
                }}
              >
                Sistema de Gestión Docente
              </h1>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.85)",
                  fontSize: "0.8125rem",
                  margin: 0,
                  fontWeight: "400",
                }}
              >
                Universidad Nacional de Lanús
              </p>
            </div>
          </div>

          {/* Navegación Principal */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Link 
              to="/" 
              style={navLinkStyle(isActive("/"))}
              onMouseEnter={(e) => {
                if (!isActive("/")) {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              Inicio
            </Link>
            <Link 
              to="/tablero" 
              style={navLinkStyle(isActive("/tablero"))}
              onMouseEnter={(e) => {
                if (!isActive("/tablero")) {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/tablero")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              Tablero Docente
            </Link>
            <Link 
              to="/gestion" 
              style={navLinkStyle(isActive("/gestion"))}
              onMouseEnter={(e) => {
                if (!isActive("/gestion")) {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/gestion")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              Gestión Académica
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;