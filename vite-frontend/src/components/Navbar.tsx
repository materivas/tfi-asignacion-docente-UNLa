import { Link, useLocation, useNavigate } from "react-router-dom";
import type { FC } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, nombre } = useAuth();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    color: "var(--color-white)",
    textDecoration: "none",
    fontWeight: active ? "700" : "500",
    fontSize: "0.875rem",
    padding: "0.5rem 1rem",
    borderRadius: "var(--border-radius-md)",
    backgroundColor: active ? "rgba(255, 255, 255, 0.18)" : "transparent",
    transition: "all var(--transition-base)",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    letterSpacing: "0.01em",
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
        boxShadow: "0 2px 12px rgba(122, 31, 31, 0.2)",
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
            padding: "0.75rem 0",
          }}
        >
          {/* Logo y Título */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "var(--color-white)",
                borderRadius: "var(--border-radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "0.8rem",
                color: "var(--color-primary)",
                letterSpacing: "-0.5px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              UNLa
            </div>
            <div>
              <h1
                style={{
                  color: "var(--color-white)",
                  fontSize: "1.0625rem",
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: "1.2",
                  letterSpacing: "-0.2px",
                }}
              >
                Gestión Docente
              </h1>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.6875rem",
                  margin: 0,
                  fontWeight: 400,
                  letterSpacing: "0.02em",
                }}
              >
                Universidad Nacional de Lanús
              </p>
            </div>
          </Link>

          {/* Navegación Principal */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <Link to="/" style={navLinkStyle(isActive("/"))}
                onMouseEnter={(e) => { if (!isActive("/")) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { if (!isActive("/")) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Inicio
              </Link>
              <Link to="/tablero" style={navLinkStyle(isActive("/tablero"))}
                onMouseEnter={(e) => { if (!isActive("/tablero")) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { if (!isActive("/tablero")) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                Tablero
              </Link>
              <Link to="/gestion" style={navLinkStyle(isActive("/gestion"))}
                onMouseEnter={(e) => { if (!isActive("/gestion")) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={(e) => { if (!isActive("/gestion")) e.currentTarget.style.backgroundColor = "transparent"; }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                Gestión
              </Link>
            </nav>

            {/* Separador */}
            <div style={{ width: "1px", height: "28px", backgroundColor: "rgba(255,255,255,0.2)", margin: "0 0.5rem" }} />

            {/* Sección de Usuario y Logout */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "rgba(255,255,255,0.85)", fontSize: "0.8125rem" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <span style={{ fontWeight: 500, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{nombre || 'Usuario'}</span>
              </div>
              
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  padding: "0.375rem 0.75rem",
                  backgroundColor: "rgba(255, 255, 255, 0.12)",
                  color: "var(--color-white)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "var(--border-radius-md)",
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all var(--transition-base)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;