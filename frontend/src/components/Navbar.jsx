import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      padding: "1rem",
      backgroundColor: "#7A1F1F",
      color: "white",
      display: "flex",
      justifyContent: "center",
      gap: "2rem"
    }}>
      <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Inicio</Link>
      <Link to="/tablero" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Tablero Docente</Link>
      <Link to="/gestion" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>Gestión Académica</Link>
    </nav>
  );
}
export default Navbar;