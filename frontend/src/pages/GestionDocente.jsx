import Layout from "../components/Layout";
import DocenteForm from "../components/Formularios/DocenteForm";

function GestionDocente() {
  return (
    <Layout>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>📘 Docentes registrados</h2>
      
      {/* Galería vacía por ahora */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p>📌 Próximamente verás la lista de docentes aquí.</p>
        <button style={btnAlta}>➕ Dar de alta nuevo docente</button>
      </div>

      {/* Formulario */}
      <DocenteForm />
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

export default GestionDocente;