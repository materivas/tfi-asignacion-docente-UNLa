import Layout from "../components/Layout";
import MateriaForm from "../components/Formularios/MateriaForm";

function GestionMateria() {
  return (
    <Layout>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>📖 Materias</h2>
      
      {/* Galería simulada */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p>📌 Aquí verás las materias registradas según año y plan.</p>
        <button style={btnAlta}>➕ Dar de alta nueva materia</button>
      </div>

      <MateriaForm />
    </Layout>
  );
}

const btnAlta = {
  backgroundColor: "#7A1F1F",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  fontWeight: "bold",
  border: "none",
  marginTop: "1rem",
  cursor: "pointer"
};

export default GestionMateria;