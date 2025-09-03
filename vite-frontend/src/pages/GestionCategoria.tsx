import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import CategoriaForm from "../components/Formularios/CategoriaForm";
import Modal from "../components/Modal";
import type { Categoria } from "../types";
import {
  listarCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
} from "../api/categoriaApi";

function GestionCategoria() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null);

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

  const handleCrear = async (categoria: Categoria) => {
    try {
      const res = await crearCategoria({
        nombre: categoria.nombre,
        maxMaterias: categoria.maxMaterias
      });
      setCategorias((prev) => [...prev, res.data]);
      alert("✅ Categoría registrada");
    } catch (err) {
      console.error("❌ Error al crear categoría:", err);
      alert("❌ No se pudo registrar la categoría");
    }
  };

  const handleEditar = async (categoria: Categoria) => {
    if (categoria.id == null) {
      alert("❌ No se puede editar una categoría sin ID.");
      return;
    }

    try {
      const res = await actualizarCategoria(categoria.id, categoria);
      setCategorias((prev) => prev.map((c) => (c.id === res.data.id ? res.data : c)));
      alert("✅ Categoría actualizada");
      setCategoriaEditando(null);
    } catch (err) {
      console.error("❌ Error al editar categoría:", err);
      alert("❌ No se pudo actualizar la categoría");
    }
  };

  const handleEliminar = async (id?: number) => {
    if (id == null) {
      alert("❌ No se puede eliminar una categoría sin ID.");
      return;
    }

    const confirmar = window.confirm("¿Eliminar esta categoría?");
    if (!confirmar) return;

    try {
      await eliminarCategoria(id);
      setCategorias((prev) => prev.filter((c) => c.id !== id));
      alert("✅ Categoría eliminada");
    } catch (err) {
      console.error("❌ Error al eliminar categoría:", err);
      alert("❌ No se pudo eliminar la categoría");
    }
  };

  return (
    <Layout>
      <h2 style={titulo}>🎓 Categorías académicas</h2>

      <div style={intro}>
        <p>📌 Aquí verás las categorías cargadas (Titular, Adjunto, etc.).</p>
      </div>

      {loading ? (
        <p style={centrado}>⏳ Cargando categorías...</p>
      ) : error ? (
        <p style={{ ...centrado, color: "red" }}>{error}</p>
      ) : categorias.length === 0 ? (
        <p style={centrado}>⚠️ No hay categorías registradas.</p>
      ) : (
        <ul style={listaEstilo}>
          {categorias.map((cat, idx) => (
            <li key={cat.id ?? `sin-id-${idx}`} style={itemEstilo}>
              🏷️ <strong>{cat.nombre}</strong> — Máx. materias: {cat.maxMaterias}
              <button onClick={() => setCategoriaEditando(cat)} style={btnEditar}>✏️</button>
              <button onClick={() => handleEliminar(cat.id)} style={btnEliminar}>🗑️</button>
            </li>
          ))}
        </ul>
      )}

      {/* Alta solo si no estás editando */}
      {!categoriaEditando && <CategoriaForm onSubmit={handleCrear} />}

      {/* Edición en modal */}
      {categoriaEditando && (
        <Modal onClose={() => setCategoriaEditando(null)}>
          <CategoriaForm
            categoriaInicial={categoriaEditando}
            onSubmit={handleEditar}
            onCancel={() => setCategoriaEditando(null)}
          />
        </Modal>
      )}
    </Layout>
  );
}

// Estilos (alineados a las otras páginas)
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

const listaEstilo: React.CSSProperties = {
  listStyleType: "none",
  padding: 0,
  maxWidth: "500px",
  margin: "0 auto",
  textAlign: "left"
};

const itemEstilo: React.CSSProperties = {
  backgroundColor: "#fff4f4",
  padding: "0.5rem",
  marginBottom: "0.5rem",
  borderRadius: "4px"
};

const btnEditar: React.CSSProperties = {
  marginLeft: "1rem",
  backgroundColor: "#1F5A7A",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "0.2rem 0.5rem",
  cursor: "pointer"
};

const btnEliminar: React.CSSProperties = {
  marginLeft: "0.5rem",
  backgroundColor: "#d9534f",
  color: "white",
  border: "none",
  borderRadius: "4px",
  padding: "0.2rem 0.5rem",
  cursor: "pointer"
};

export default GestionCategoria;