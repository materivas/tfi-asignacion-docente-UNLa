import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PlanForm from "../components/Formularios/PlanForm";
import Modal from "../components/Modal";
import type { Plan } from "../types";
import {
  crearPlan,
  actualizarPlan,
  eliminarPlan,
  listarPlanes
} from "../api/planApi";

function GestionPlan() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planEditando, setPlanEditando] = useState<Plan | null>(null);

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const res = await listarPlanes();
        setPlanes(res.data);
      } catch (err) {
        console.error("❌ Error al cargar planes:", err);
        setError("No se pudieron cargar los planes académicos.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlanes();
  }, []);

  const handleCrear = async (plan: Plan) => {
    try {
      const res = await crearPlan({ nombre: plan.nombre, descripcion: plan.descripcion });
      setPlanes((prev) => [...prev, res.data]);
      alert("✅ Plan registrado");
    } catch (err) {
      console.error("❌ Error al crear plan:", err);
      alert("❌ No se pudo registrar el plan");
    }
  };

  const handleEditar = async (plan: Plan) => {
    if (plan.id == null) {
      alert("❌ No se puede editar un plan sin ID.");
      return;
    }

    try {
      const res = await actualizarPlan(plan.id, plan);
      setPlanes((prev) =>
        prev.map((p) => (p.id === res.data.id ? res.data : p))
      );
      alert("✅ Plan actualizado");
      setPlanEditando(null);
    } catch (err) {
      console.error("❌ Error al editar plan:", err);
      alert("❌ No se pudo actualizar el plan");
    }
  };

  const handleEliminar = async (id?: number) => {
    if (id == null) {
      alert("❌ No se puede eliminar un plan sin ID.");
      return;
    }

    const confirmar = window.confirm("¿Eliminar este plan?");
    if (!confirmar) return;

    try {
      await eliminarPlan(id);
      setPlanes((prev) => prev.filter((p) => p.id !== id));
      alert("✅ Plan eliminado");
    } catch (err) {
      console.error("❌ Error al eliminar plan:", err);
      alert("❌ No se pudo eliminar el plan");
    }
  };

  return (
    <Layout>
      <h2 style={titulo}>📋 Planes académicos</h2>

      {!planEditando && <PlanForm onSubmit={handleCrear} />}

      {planEditando && (
        <Modal onClose={() => setPlanEditando(null)}>
          <PlanForm
            planInicial={planEditando}
            onSubmit={handleEditar}
            onCancel={() => setPlanEditando(null)}
          />
        </Modal>
      )}

      <div style={seccionListado}>
        <h3>📚 Listado de planes</h3>

        {loading ? (
          <p style={centrado}>⏳ Cargando planes...</p>
        ) : error ? (
          <p style={{ ...centrado, color: "red" }}>{error}</p>
        ) : planes.length === 0 ? (
          <p style={centrado}>⚠️ No hay planes registrados.</p>
        ) : (
          <ul style={listaEstilo}>
            {planes.map((plan) => (
              <li key={plan.id} style={itemEstilo}>
                🗂️ <strong>{plan.nombre}</strong> — {plan.descripcion ?? "Sin descripción"}
                <button onClick={() => setPlanEditando(plan)} style={btnEditar}>✏️</button>
                <button onClick={() => handleEliminar(plan.id)} style={btnEliminar}>🗑️</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

// Estilos
const titulo: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "1rem"
};

const seccionListado: React.CSSProperties = {
  marginTop: "2rem",
  textAlign: "center"
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
  backgroundColor: "#f0f0f0",
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

export default GestionPlan;