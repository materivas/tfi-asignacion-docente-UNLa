import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PlanForm from "../components/Formularios/PlanForm";
import { listarPlanes } from "../api/planApi";
import type { Plan } from "../types";

function GestionPlan() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Layout>
      <h2 style={titulo}>📋 Planes académicos</h2>
      <PlanForm />

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
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

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

export default GestionPlan;