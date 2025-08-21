import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import CuatrimestreForm from "../components/Formularios/CuatrimestreForm";
import { listarCuatrimestres } from "../api/cuatrimestreApi";
import type { Cuatrimestre } from "../types";

function GestionCuatrimestre() {
  const [cuatrimestres, setCuatrimestres] = useState<Cuatrimestre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCuatrimestres = async () => {
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

    fetchCuatrimestres();
  }, []);

  return (
    <Layout>
      <h2 style={titulo}>📆 Cuatrimestres</h2>

      <div style={intro}>
        <p>📌 Aquí verás los cuatrimestres registrados por año y número.</p>
        <button style={btnAlta}>➕ Dar de alta nuevo cuatrimestre</button>
      </div>

      <CuatrimestreForm />

      <div style={seccionListado}>
        <h3>🗓️ Listado de cuatrimestres</h3>

        {loading ? (
          <p style={centrado}>⏳ Cargando cuatrimestres...</p>
        ) : error ? (
          <p style={{ ...centrado, color: "red" }}>{error}</p>
        ) : cuatrimestres.length === 0 ? (
          <p style={centrado}>⚠️ No hay cuatrimestres registrados.</p>
        ) : (
          <ul style={listaEstilo}>
            {cuatrimestres.map((c) => (
              <li key={c.id} style={itemEstilo}>
                📅 <strong>Cuatrimestre {c.numeroCuatri}</strong> — Año 2025
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

const intro: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "2rem"
};

const seccionListado: React.CSSProperties = {
  marginTop: "2rem",
  textAlign: "center"
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
  backgroundColor: "#f0f0f0",
  padding: "0.5rem",
  marginBottom: "0.5rem",
  borderRadius: "4px"
};

export default GestionCuatrimestre;