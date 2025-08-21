import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DocenteForm from "../components/Formularios/DocenteForm";
import { listarDocentes } from "../api/docenteApi";
import { listarCategorias } from "../api/categoriaApi";
import type { Docente, Categoria } from "../types";

function GestionDocente() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [categoriasMap, setCategoriasMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docentes, resCategorias] = await Promise.all([
          listarDocentes(),
          listarCategorias()
        ]);

        setDocentes(docentes);

        const map = new Map<number, string>();
        resCategorias.data.forEach((cat: Categoria) => {
          map.set(cat.id , cat.nombre);
        });
        setCategoriasMap(map);
      } catch (err) {
        setError("No se pudieron cargar los docentes o las categorías.");
        console.error("❌ Error en carga:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <h2 style={titulo}>👨‍🏫 Gestión de docentes</h2>

      <div style={intro}>
        <p>📌 Aquí verás los docentes registrados y sus categorías académicas.</p>
        <button style={btnAlta}>➕ Dar de alta nuevo docente</button>
      </div>

      {loading ? (
        <p style={centrado}>⏳ Cargando docentes...</p>
      ) : error ? (
        <p style={{ ...centrado, color: "red" }}>{error}</p>
      ) : (
        <ul style={listaEstilo}>
          {docentes.map((doc) => (
            <li key={doc.id} style={itemEstilo}>
              🧑‍🏫 <strong>{doc.nombre}</strong> — {categoriasMap.get(doc.categoriaId ?? -1) ?? "Sin categoría"}
            </li>
          ))}
        </ul>
      )}

      <DocenteForm />
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
  backgroundColor: "#1F4F7A",
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
  maxWidth: "500px",
  margin: "0 auto",
  textAlign: "left"
};

const itemEstilo: React.CSSProperties = {
  backgroundColor: "#f0f8ff",
  padding: "0.5rem",
  marginBottom: "0.5rem",
  borderRadius: "4px"
};

export default GestionDocente;