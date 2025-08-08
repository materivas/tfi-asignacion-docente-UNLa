import { Link } from 'react-router-dom';
import Layout from "../components/Layout";

function Gestion() {
  return (
    <Layout>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Gestión Académica</h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
        <Link to="/gestion/docentes" style={linkEstilo}>Docentes</Link>
        <Link to="/gestion/categorias" style={linkEstilo}>Categorías</Link>
        <Link to="/gestion/planes" style={linkEstilo}>Planes</Link>
        <Link to="/gestion/materias" style={linkEstilo}>Materias</Link>
        <Link to="/gestion/cuatrimestre" style={linkEstilo}>Materias</Link>
      </div>
    </Layout>
  );
}

const linkEstilo = {
  backgroundColor: "#7A1F1F",
  color: "white",
  padding: "1rem 2rem",
  borderRadius: "8px",
  fontWeight: "bold",
  textDecoration: "none"
};

export default Gestion;