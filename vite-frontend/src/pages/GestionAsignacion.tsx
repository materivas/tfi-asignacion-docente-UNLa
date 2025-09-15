import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AsignacionForm from "../components/Formularios/AsignacionForm";
import Modal from "../components/Modal";
import {
  listarAsignaciones,
  crearAsignacion,
  actualizarAsignacion,
  eliminarAsignacion
} from "../api/asignacionApi";
import { listarMaterias } from "../api/materiaApi";
import { listarCuatrimestres } from "../api/cuatrimestreApi";
import type { Asignacion, Materia, Cuatrimestre } from "../types";

function GestionAsignacion() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [cuatrimestres, setCuatrimestres] = useState<Cuatrimestre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asignacionEditando, setAsignacionEditando] = useState<Asignacion | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resAsignaciones, resMaterias, resCuatrimestres] = await Promise.all([
          listarAsignaciones(),
          listarMaterias(),
          listarCuatrimestres()
        ]);

        setAsignaciones(resAsignaciones.data);
        setMaterias(resMaterias.data);
        setCuatrimestres(resCuatrimestres.data);
      } catch (err) {
        console.error("❌ Error al cargar asignaciones:", err);
        setError("No se pudieron cargar las asignaciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditar = async (asignacion: Asignacion) => {
    if (asignacion.id == null) {
      console.warn("❌ No se puede editar una asignación sin ID");
      alert("❌ La asignación no tiene ID asignado");
      return;
    }

    try {
      const actualizada = await actualizarAsignacion(asignacion.id, asignacion);
      setAsignaciones((prev) =>
        prev.map((a) => (a.id === actualizada.data.id ? actualizada.data : a))
      );
      alert("✅ Asignación actualizada");
      setAsignacionEditando(null);
    } catch (err) {
      console.error("❌ Error al editar asignación:", err);
      alert("❌ No se pudo actualizar la asignación");
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm("¿Estás seguro de que querés eliminar esta asignación?");
    if (!confirmar) return;

    try {
      await eliminarAsignacion(id);
      setAsignaciones((prev) => prev.filter((a) => a.id !== id));
      alert("✅ Asignación eliminada");
    } catch (err) {
      console.error("❌ Error al eliminar asignación:", err);
      alert("❌ No se pudo eliminar la asignación");
    }
  };

  const handleCrear = async (asignacion: Asignacion) => {
    try {
      const res = await crearAsignacion(asignacion);
      setAsignaciones((prev) => [...prev, res.data]);
      alert("✅ Asignación registrada");
    } catch (err) {
      console.error("❌ Error al crear asignación:", err);
      alert("❌ No se pudo registrar la asignación");
    }
  };

  return (
    <Layout>
      <h2 style={titulo}>📚 Asignaciones</h2>

      <div style={intro}>
        <p>📌 Aquí verás las asignaciones registradas por materia, cuatrimestre y turno.</p>
      </div>

      {loading ? (
        <p style={centrado}>⏳ Cargando asignaciones...</p>
      ) : error ? (
        <p style={{ ...centrado, color: "red" }}>{error}</p>
      ) : asignaciones.length === 0 ? (
        <p style={centrado}>⚠️ No hay asignaciones registradas.</p>
      ) : (
        <ul style={listaEstilo}>
          {asignaciones.map((asig) => {
            const materia = materias.find((m) => m.id === asig.materiaId);
            const cuatri = cuatrimestres.find((c) => c.id === asig.cuatrimestreId);
            return (
              <li key={asig.id} style={itemEstilo}>
                📘 <strong>{materia?.nombre ?? "Materia desconocida"}</strong> — Cuatrimestre {cuatri?.numeroCuatri ?? "?"} — Turno {asig.turno}
                <button onClick={() => setAsignacionEditando(asig)} style={btnEditar}>✏️</button>
                <button onClick={() => asig.id != null && handleEliminar(asig.id)} style={btnEliminar}>🗑️</button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Alta solo si no estás editando */}
      {!asignacionEditando && (
        <AsignacionForm
          materias={materias}
          cuatrimestres={cuatrimestres}
          onSubmit={handleCrear}
        />
      )}

      {/* Edición en modal */}
      {asignacionEditando && (
        <Modal onClose={() => setAsignacionEditando(null)}>
          <AsignacionForm
            materias={materias}
            cuatrimestres={cuatrimestres}
            AsignacionInicial={asignacionEditando}
            onSubmit={handleEditar}
            onCancel={() => setAsignacionEditando(null)}
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

export default GestionAsignacion;