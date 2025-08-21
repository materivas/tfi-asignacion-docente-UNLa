import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Materia, Plan } from "../../types";
import { crearMateria } from "../../api/materiaApi";

interface Props {
  planes: Pick<Plan, "id" | "nombre">[] | undefined;
}

const MateriaForm: React.FC<Props> = ({ planes }) => {
  const [nombre, setNombre] = useState("");
  const [planId, setPlanId] = useState<number | "">("");
  const [anio, setAnio] = useState<number | "">("");

  // Validación defensiva
  if (!planes || !Array.isArray(planes)) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
        ❌ Error: No se pudieron cargar los planes académicos.
      </p>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombre || planId === "" || anio === "") {
      alert("Completá todos los campos.");
      return;
    }

    const nuevaMateria: Materia = {
      nombre,
      planId: Number(planId),
      anio: Number(anio)
    };

    try {
      const res = await crearMateria(nuevaMateria);
      console.log("✅ Materia registrada:", res.data);
      alert("✅ Materia guardada con éxito.");
      setNombre("");
      setPlanId("");
      setAnio("");
    } catch (error) {
      console.error("❌ Error al guardar la materia:", error);
      alert("❌ Hubo un error al guardar la materia.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h3 style={{ textAlign: "center" }}>Alta de Materia</h3>

      <label>Nombre:</label>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        style={inputEstilo}
      />

      <label>Plan académico:</label>
      <select
        value={planId}
        onChange={(e) => setPlanId(Number(e.target.value))}
        required
        style={inputEstilo}
      >
        <option value="">Seleccione</option>
        {planes.map((plan) => (
          <option key={plan.id} value={plan.id}>
            {plan.nombre}
          </option>
        ))}
      </select>

      <label>Año:</label>
      <input
        type="number"
        value={anio}
        onChange={(e) => setAnio(Number(e.target.value))}
        required
        style={inputEstilo}
      />

      <button type="submit" style={btnEstilo}>
        Registrar
      </button>
    </form>
  );
};

const inputEstilo: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.5rem",
  marginBottom: "1rem",
  borderRadius: "4px",
  border: "1px solid #ccc"
};

const btnEstilo: React.CSSProperties = {
  backgroundColor: "#7A1F1F",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
  width: "100%"
};

export default MateriaForm;