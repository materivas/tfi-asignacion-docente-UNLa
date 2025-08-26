import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import DocenteForm from "../components/Formularios/DocenteForm";
import Modal from "../components/Modal";
import { listarDocentes, crearDocente, eliminarDocente, actualizarDocente } from "../api/docenteApi";
import { listarCategorias } from "../api/categoriaApi";
import type { Docente, Categoria } from "../types";

function GestionDocente() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [categoriasMap, setCategoriasMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docenteEditando, setDocenteEditando] = useState<Docente | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resDocentes, resCategorias] = await Promise.all([
          listarDocentes(),
          listarCategorias()
        ]);

        setDocentes(resDocentes);

        const map = new Map<number, string>();
        resCategorias.data.forEach((cat: Categoria) => {
          resCategorias.data.forEach((cat: Categoria) => {
            if (cat.id != null) {
              map.set(cat.id, cat.nombre);
            }
          });

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

  const handleCrear = async (docente: Docente) => {
    try {
      const nuevo = await crearDocente(docente);
      setDocentes((prev) => [...prev, nuevo]);
      alert("✅ Docente registrado");
    } catch (err) {
      console.error("❌ Error al crear docente:", err);
      alert("❌ No se pudo registrar el docente");
    }
  };

  const handleEditar = async (docente: Docente) => {
    if (docente.id == null) {
      alert("❌ No se puede editar un docente sin ID");
      return;
    }

    try {
      const actualizado = await actualizarDocente(docente.id, docente);
      setDocentes((prev) =>
        prev.map((d) => (d.id === actualizado.id ? actualizado : d))
      );
      alert("✅ Docente actualizado");
      setDocenteEditando(null);
    } catch (err) {
      console.error("❌ Error al editar docente:", err);
      alert("❌ No se pudo actualizar el docente");
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm("¿Eliminar este docente?");
    if (!confirmar) return;

    try {
      await eliminarDocente(id);
      setDocentes((prev) => prev.filter((d) => d.id !== id));
      alert("✅ Docente eliminado");
    } catch (err) {
      console.error("❌ Error al eliminar docente:", err);
      alert("❌ No se pudo eliminar el docente");
    }
  };

  return (
    <Layout>
      <h2 style={titulo}>👨‍🏫 Gestión de docentes</h2>

      <div style={intro}>
        <p>📌 Aquí verás los docentes registrados y sus categorías académicas.</p>
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
              <button onClick={() => setDocenteEditando(doc)} style={btnEditar}>✏️</button>
              <button onClick={() => doc.id != null && handleEliminar(doc.id)} style={btnEliminar}>🗑️</button>
            </li>
          ))}
        </ul>
      )}

      {!docenteEditando && (
        <DocenteForm onSubmit={handleCrear} />
      )}

      {docenteEditando && (
        <Modal onClose={() => setDocenteEditando(null)}>
          <DocenteForm
            docenteInicial={docenteEditando}
            onSubmit={handleEditar}
            onCancel={() => setDocenteEditando(null)}
          />
        </Modal>
      )}
    </Layout>
  );
}

// Estilos
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
