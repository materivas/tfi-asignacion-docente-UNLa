import { useState } from "react";
import Layout from "../components/Layout";
import DocenteForm from "../components/DocenteForm";
import MateriaForm from "../components/MateriaForm";
import PlanForm from "../components/PlanForm";
import CuatrimestreForm from "../components/CuatrimestreForm";

function Gestion() {
  const [seccion, setSeccion] = useState("docente");

  const botones = [
    { id: "docente", label: "Alta Docente" },
    { id: "materia", label: "Alta Materia" },
    { id: "plan", label: "Alta Plan" },
    { id: "cuatrimestre", label: "Alta Cuatrimestre" }
  ];

  return (
    <Layout>
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Gestión Académica</h2>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "1rem",
        marginBottom: "2rem",
        flexWrap: "wrap"
      }}>
        {botones.map(btn => (
          <button
            key={btn.id}
            style={seccion === btn.id ? botonActivo : botonInactivo}
            onClick={() => setSeccion(btn.id)}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {seccion === "docente" && <DocenteForm />}
      {seccion === "materia" && <MateriaForm />}
      {seccion === "plan" && <PlanForm />}
      {seccion === "cuatrimestre" && <CuatrimestreForm />}
    </Layout>
  );
}

const botonActivo = {
  backgroundColor: "#7A1F1F",
  color: "white",
  border: "none",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer"
};

const botonInactivo = {
  backgroundColor: "#F2E7DC",
  color: "#7A1F1F",
  border: "1px solid #7A1F1F",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  fontWeight: "normal",
  cursor: "pointer"
};

export default Gestion;