import Layout from "../components/Layout";
import CategoriaForm from "../components/Formularios/CategoriaForm";

function GestionCategoria() {
  return (
    <Layout>
      <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>🎓 Categorías académicas</h2>
      
      {/* Galería simulada */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <p>📌 Aquí verás las categorías cargadas (Titular, Adjunto, etc).</p>
        <button style={btnAlta}>➕ Dar de alta nueva categoría</button>
      </div>

      <CategoriaForm />
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

export default GestionCategoria;