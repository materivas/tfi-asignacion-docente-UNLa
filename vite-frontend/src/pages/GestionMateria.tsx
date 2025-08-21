import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import MateriaForm from "../components/Formularios/MateriaForm";
import { listarMaterias } from "../api/materiaApi";
import { listarPlanes } from "../api/planApi";
import type { Materia, Plan } from "../types";

function GestionMateria() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [planesMap, setPlanesMap] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          map.set(plan.id, plan.nombre);
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

  return (
    <Layout>
      <h2 style={titulo}>📖 Materias</h2>

      <div style={intro}>
        <p>📌 Aquí verás las materias registradas según año y plan.</p>
        <button style={btnAlta}>➕ Dar de alta nueva materia</button>
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
            </li>
          ))}
        </ul>
      )}

      <MateriaForm planes={Array.from(planesMap.entries()).map(([id, nombre]) => ({ id, nombre }))} />
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