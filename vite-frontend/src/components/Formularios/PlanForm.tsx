import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import type { Plan } from "../../types";

interface Props {
  planInicial?: Plan;
  onSubmit?: (plan: Plan) => void | Promise<void>;
  onCancel?: () => void;
}

const PlanForm: React.FC<Props> = ({ planInicial, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState<string>(planInicial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState<string>(planInicial?.descripcion ?? "");

  useEffect(() => {
    if (planInicial) {
      setNombre(planInicial.nombre ?? "");
      setDescripcion(planInicial.descripcion ?? "");
    } else {
      setNombre("");
      setDescripcion("");
    }
  }, [planInicial]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !descripcion) {
      alert("Completá ambos campos.");
      return;
    }

    const payload: Plan = {
      ...(planInicial?.id != null && { id: planInicial.id }),
      nombre,
      descripcion,
    };

    if (onSubmit) {
      await onSubmit(payload);
      // reseteo solo en alta; si estás editando normalmente cerrás con onCancel
      if (!planInicial) {
        setNombre("");
        setDescripcion("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h3 style={{ textAlign: "center" }}>
        {planInicial ? "Editar Plan" : "Alta de Plan"}
      </h3>

      <label>Nombre:</label>
      <input
        value={nombre}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
        required
        style={inputEstilo}
        placeholder="Ej: Plan 2025"
      />

      <label>Descripción:</label>
      <textarea
        value={descripcion}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescripcion(e.target.value)}
        required
        style={{ ...inputEstilo, height: "6rem", resize: "vertical" }}
        placeholder="Resumen del plan académico…"
      />

      <button type="submit" style={btnEstilo}>
        {planInicial ? "Guardar cambios" : "Registrar"}
      </button>

      {planInicial && onCancel && (
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

export default PlanForm;
