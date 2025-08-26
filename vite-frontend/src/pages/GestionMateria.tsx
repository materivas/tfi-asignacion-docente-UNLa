import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import MateriaForm from "../components/Formularios/MateriaForm";
import Modal from "../components/Modal";
import {
  listarMaterias,
  actualizarMateria,
  eliminarMateria,
  crearMateria
} from "../api/materiaApi";
import { listarPlanes } from "../api/planApi";
import type { Materia, Plan } from "../types";

function GestionMateria() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [planesMap, setPlanesMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [materiaEditando, setMateriaEditando] = useState<Materia | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resMaterias, resPlanes] = await Promise.all([
          listarMaterias(),
          listarPlanes()
        ]);

        setMaterias(resMaterias.data);

        const map = new Map<number, string>();
        resPlanes.data.forEach((plan: Plan) => {
          if (plan.id != null) {
            map.set(plan.id, plan.nombre);
          }

        });
        setPlanesMap(map);
      } catch (err) {
        console.error("❌ Error al cargar materias o planes:", err);
        setError("No se pudieron cargar las materias o los planes.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditar = async (materia: Materia) => {
    if (materia.id == null) {
      console.warn("❌ No se puede editar una materia sin ID");
      alert("❌ La materia no tiene ID asignado");
      return;
    }

    try {
      const actualizada = await actualizarMateria(materia.id, materia);
      setMaterias((prev) =>
        prev.map((m) => (m.id === actualizada.data.id ? actualizada.data : m))
      );
      alert("✅ Materia actualizada");
      setMateriaEditando(null);
    } catch (err) {
      console.error("❌ Error al editar materia:", err);
      alert("❌ No se pudo actualizar la materia");
    }
  };
  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm("¿Estás seguro de que querés eliminar esta materia?");
    if (!confirmar) return;

    try {
      await eliminarMateria(id);
      setMaterias((prev) => prev.filter((m) => m.id !== id));
      alert("✅ Materia eliminada");
    } catch (err) {
      console.error("❌ Error al eliminar materia:", err);
      alert("❌ No se pudo eliminar la materia");
    }
  };

  const handleCrear = async (materia: Materia) => {
    try {
      const res = await crearMateria(materia);
      setMaterias((prev) => [...prev, res.data]);
      alert("✅ Materia registrada");
    } catch (err) {
      console.error("❌ Error al crear materia:", err);
      alert("❌ No se pudo registrar la materia");
    }
  };

  return (
    <Layout>
      <h2 style={titulo}>📖 Materias</h2>

      <div style={intro}>
        <p>📌 Aquí verás las materias registradas según año y plan.</p>
      </div>

      {loading ? (
        <p style={centrado}>⏳ Cargando materias...</p>
      ) : error ? (
        <p style={{ ...centrado, color: "red" }}>{error}</p>
      ) : materias.length === 0 ? (
        <p style={centrado}>⚠️ No hay materias registradas.</p>
      ) : (
        <ul style={listaEstilo}>
          {materias.map((mat) => (
            <li key={mat.id} style={itemEstilo}>
              📘 <strong>{mat.nombre}</strong> — Año {mat.anio} — {planesMap.get(mat.planId) ?? "Sin plan"}
              <button onClick={() => setMateriaEditando(mat)} style={btnEditar}>✏️</button>
              <button onClick={() => mat.id != null && handleEliminar(mat.id)} style={btnEliminar}>🗑️</button>
            </li>
          ))}
        </ul>
      )}

      {/* Alta solo si no estás editando */}
      {!materiaEditando && (
        <MateriaForm
          planes={Array.from(planesMap.entries()).map(([id, nombre]) => ({ id, nombre }))}
          onSubmit={handleCrear}
        />
      )}

      {/* Edición en modal */}
      {materiaEditando && (
        <Modal onClose={() => setMateriaEditando(null)}>
          <MateriaForm
            materiaInicial={materiaEditando}
            planes={Array.from(planesMap.entries()).map(([id, nombre]) => ({ id, nombre }))}
            onSubmit={handleEditar}
            onCancel={() => setMateriaEditando(null)}
          />
        </Modal>
      )}
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
  backgroundColor: "#fff4f4",
  padding: "0.5rem",
  marginBottom: "0.5rem",
  borderRadius: "4px"
};

export default GestionMateria;