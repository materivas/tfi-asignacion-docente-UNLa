import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { FC } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, nombre, rol } = useAuth();

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
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)", boxShadow: "0 2px 12px rgba(122, 31, 31, 0.2)", position: "sticky", top: 0, zIndex: 1000 }}>
            <div className="container">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.75rem 0" }}>
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
                        <div style={{ width: "40px", height: "40px", backgroundColor: "var(--color-white)", borderRadius: "var(--border-radius-md)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem", color: "var(--color-primary)" }}>
                            UNLa
                        </div>
                        <div>
                            <h1 style={{ color: "var(--color-white)", fontSize: "1.0625rem", fontWeight: 700, margin: 0 }}>Gestión Docente</h1>
                        </div>
                    </Link>

                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <Link to="/" style={navLinkStyle(isActive("/"))}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                                Inicio
                            </Link>

                            {rol === 'ROLE_ADMIN' && (
                                <>
                                    <Link to="/tablero" style={navLinkStyle(isActive("/tablero"))}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                                        Tablero
                                    </Link>
                                    <Link to="/gestion" style={navLinkStyle(isActive("/gestion"))}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                                        Gestión
                                    </Link>
                                </>
                            )}

                            {rol === 'ROLE_DOCENTE' && (
                                <Link to="/mis-horarios" style={navLinkStyle(isActive("/mis-horarios"))}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                    Mis Horarios
                                </Link>
                            )}
                        </nav>

                        <div style={{ width: "1px", height: "28px", backgroundColor: "rgba(255,255,255,0.2)", margin: "0 0.5rem" }} />

                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <span style={{ color: "white", fontSize: "0.875rem", fontWeight: "500" }}>
                                Prof. {nombre}
                            </span>
                            <button
                                onClick={handleLogout}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.375rem',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: '#ffffff',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    padding: '0.4rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
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
