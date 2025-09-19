import { useState } from "react";
import type { FormEvent } from "react";
import type { Materia, Plan } from "../../types";

interface Props {
  planes: Pick<Plan, "id" | "nombre">[] | undefined;
  materiaInicial?: Materia;
  onSubmit?: (materia: Materia) => void;
  onCancel?: () => void;
}

const MateriaForm: React.FC<Props> = ({ planes, materiaInicial, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState(materiaInicial?.nombre ?? "");
  const [planId, setPlanId] = useState<number | "">(materiaInicial?.planId ?? "");
  const [anio, setAnio] = useState<number | "">(materiaInicial?.anio ?? "");

  if (!planes || !Array.isArray(planes)) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
        ❌ Error: No se pudieron cargar los planes académicos.
      </p>
    );
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombre || planId === "" || anio==="") {
      alert("Completá todos los campos.");
      return;
    }

    const materia: Materia = {
      nombre,
      anio: Number(anio),
      planId: Number(planId),
      ...(materiaInicial?.id != null && { id: materiaInicial.id })
    };

    if (onSubmit) {
      await onSubmit(materia);
      setNombre("");
      setPlanId("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h3 style={{ textAlign: "center" }}>
        {materiaInicial ? "Editar Materia" : "Alta de Materia"}
      </h3>

      <label>Nombre:</label>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        style={inputEstilo}
      />

      <label>Año en la carrera:</label>
<input
  type="number"
  value={anio}
  onChange={(e) => setAnio(Number(e.target.value))}
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

      <button type="submit" style={btnEstilo}>
        {materiaInicial ? "Guardar cambios" : "Registrar"}
      </button>

      {materiaInicial && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          style={{ ...btnEstilo, backgroundColor: "#999", marginTop: "0.5rem" }}
        >
          Cancelar edición
        </button>
      )}
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