import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import CategoriaForm from "../components/Formularios/CategoriaForm";
import { listarCategorias } from "../api/categoriaApi";
import type { Categoria } from "../types";

function GestionCategoria() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await listarCategorias();
        setCategorias(res.data);
      } catch (err) {
        setError("No se pudieron cargar las categorías.");
        console.error("❌ Error al listar categorías:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <Layout>
      <h2 style={titulo}>🎓 Categorías académicas</h2>

      <div style={intro}>
        <p>📌 Aquí verás las categorías cargadas (Titular, Adjunto, etc).</p>
        <button style={btnAlta}>➕ Dar de alta nueva categoría</button>
      </div>

      {loading ? (
        <p style={centrado}>⏳ Cargando categorías...</p>
      ) : error ? (
        <p style={{ ...centrado, color: "red" }}>{error}</p>
      ) : (
        <ul style={listaEstilo}>
          {categorias.map((cat) => (
            <li key={cat.id} style={itemEstilo}>
              🏷️ <strong>{cat.nombre}</strong> <strong>{cat.maxMaterias}</strong>
            </li>
          ))}
        </ul>
      )}

      <CategoriaForm />
    </Layout>
  );
}

const titulo: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "1rem"
};

const intro: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "2rem"
};

const centrado: React.CSSProperties = {
  textAlign: "center"
};

const btnAlta: React.CSSProperties = {
  backgroundColor: "#7A1F1F",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  fontWeight: "bold",
  border: "none",
  marginTop: "1rem",
  cursor: "pointer"
};

const listaEstilo: React.CSSProperties = {
  listStyleType: "none",
  padding: 0,
  maxWidth: "400px",
  margin: "0 auto",
  textAlign: "left"
};

const itemEstilo: React.CSSProperties = {
  backgroundColor: "#f4f4f4",
  padding: "0.5rem",
  marginBottom: "0.5rem",
  borderRadius: "4px"
};

export default GestionCategoria;