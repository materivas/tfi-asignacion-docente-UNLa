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
    fontWeight: active ? "600" : "500",
    fontSize: "0.9375rem",
    padding: "0.625rem 1.25rem",
    borderRadius: "var(--border-radius-md)",
    backgroundColor: active ? "rgba(255, 255, 255, 0.15)" : "transparent",
    transition: "all var(--transition-base)",
    display: "inline-block",
    borderBottom: active ? "2px solid var(--color-white)" : "2px solid transparent",
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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

            {/* Sección de Usuario y Logout */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginLeft: "1rem",
              paddingLeft: "1rem",
              borderLeft: "1px solid rgba(255, 255, 255, 0.2)"
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--color-white)",
                fontSize: "0.875rem"
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontWeight: "500" }}>{nombre || 'Usuario'}</span>
              </div>
              
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  color: "var(--color-white)",
                  border: "none",
                  borderRadius: "var(--border-radius-md)",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all var(--transition-base)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.25)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;