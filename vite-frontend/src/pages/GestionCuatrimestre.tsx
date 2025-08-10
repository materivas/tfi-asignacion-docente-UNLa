import Layout from "../components/Layout";
import CuatrimestreForm from "../components/Formularios/CuatrimestreForm"

function GestionCuatrimestre() {
  return (
    <Layout>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>📆 Cuatrimestres</h2>
      
      {/* Galería simulada */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p>📌 Aquí verás los cuatrimestres registrados por año y número.</p>
        <button style={btnAlta}>➕ Dar de alta nuevo cuatrimestre</button>
      </div>

      {/* Formulario */}
      <CuatrimestreForm />
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

export default GestionCuatrimestre;