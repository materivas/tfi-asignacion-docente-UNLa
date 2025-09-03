import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import CuatrimestreForm from "../components/Formularios/CuatrimestreForm";
import Modal from "../components/Modal";
import {
  listarCuatrimestres,
  crearCuatrimestre,
  actualizarCuatrimestre,
  eliminarCuatrimestre
} from "../api/cuatrimestreApi";
import type { Cuatrimestre } from "../types";

function GestionCuatrimestre() {
  const [cuatrimestres, setCuatrimestres] = useState<Cuatrimestre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cuatrimestreEditando, setCuatrimestreEditando] = useState<Cuatrimestre | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await listarCuatrimestres();
        setCuatrimestres(res.data);
      } catch (err) {
        console.error("❌ Error al cargar cuatrimestres:", err);
        setError("No se pudieron cargar los cuatrimestres.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCrear = async (cuatrimestre: Cuatrimestre) => {
    try {
      const res = await crearCuatrimestre(cuatrimestre);
      setCuatrimestres((prev) => [...prev, res.data]);
      alert("✅ Cuatrimestre registrado");
    } catch (err) {
      console.error("❌ Error al crear cuatrimestre:", err);
      alert("❌ No se pudo registrar el cuatrimestre");
    }
  };

  const handleEditar = async (cuatrimestre: Cuatrimestre) => {
    if (cuatrimestre.id == null) {
      console.warn("❌ No se puede editar un cuatrimestre sin ID");
      alert("❌ El cuatrimestre no tiene ID asignado");
      return;
    }

    try {
      const actualizado = await actualizarCuatrimestre(cuatrimestre.id, cuatrimestre);
      setCuatrimestres((prev) =>
        prev.map((c) => (c.id === actualizado.data.id ? actualizado.data : c))
      );
      alert("✅ Cuatrimestre actualizado");
      setCuatrimestreEditando(null);
    } catch (err) {
      console.error("❌ Error al editar cuatrimestre:", err);
      alert("❌ No se pudo actualizar el cuatrimestre");
    }
  };

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm("¿Estás seguro de que querés eliminar este cuatrimestre?");
    if (!confirmar) return;

    try {
      await eliminarCuatrimestre(id);
      setCuatrimestres((prev) => prev.filter((c) => c.id !== id));
      alert("✅ Cuatrimestre eliminado");
    } catch (err) {
      console.error("❌ Error al eliminar cuatrimestre:", err);
      alert("❌ No se pudo eliminar el cuatrimestre");
    }
  };

  return (
    <Layout>
      <h2 style={titulo}>📆 Cuatrimestres</h2>

      <div style={intro}>
        <p>📌 Aquí verás los cuatrimestres registrados por año y número.</p>
      </div>

      {loading ? (
        <p style={centrado}>⏳ Cargando cuatrimestres...</p>
      ) : error ? (
        <p style={{ ...centrado, color: "red" }}>{error}</p>
      ) : cuatrimestres.length === 0 ? (
        <p style={centrado}>⚠️ No hay cuatrimestres registrados.</p>
      ) : (
        <ul style={listaEstilo}>
          {cuatrimestres.map((c, idx) => (
            <li key={c.id ?? `sin-id-${idx}`} style={itemEstilo}>
              🗓️ <strong>Cuatrimestre {c.numeroCuatri}</strong>
              {" · "}
              {typeof (c as any).anio !== "undefined" ? `Año ${(c as any).anio}` : "Año no especificado"}
              <button onClick={() => setCuatrimestreEditando(c)} style={btnEditar}>✏️</button>
              {c.id != null && (
                <button onClick={() => handleEliminar(c.id!)} style={btnEliminar}>🗑️</button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Alta solo si no estás editando */}
      {!cuatrimestreEditando && (
        <CuatrimestreForm onSubmit={handleCrear} />
      )}

      {/* Edición en modal */}
      {cuatrimestreEditando && (
        <Modal onClose={() => setCuatrimestreEditando(null)}>
          <CuatrimestreForm
            cuatrimestreInicial={cuatrimestreEditando}
            onSubmit={handleEditar}
            onCancel={() => setCuatrimestreEditando(null)}
          />
        </Modal>
      )}
    </Layout>
  );
}

// Estilos (alineados a GestionMateria)
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

export default GestionCuatrimestre;
