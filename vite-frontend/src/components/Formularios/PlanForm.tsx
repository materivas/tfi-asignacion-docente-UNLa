import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Plan } from "../../types";
import { crearPlan } from "../../api/planApi";

type Props = {
  planInicial?: Plan;
  onSubmit: (plan: Plan) => void;
  onCancel?: () => void;
};

const PlanForm: React.FC<Props> = ({ planInicial, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");

  useEffect(() => {
    if (planInicial) {
      setNombre(planInicial.nombre);
      setDescripcion(planInicial.descripcion);
    }
  }, [planInicial]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombre || !descripcion) {
      alert("Completá ambos campos.");
      return;
    }

    const planFinal: Plan = {
      id: planInicial?.id ?? 0,
      nombre,
      descripcion
    };

    onSubmit(planFinal);
    setNombre("");
    setDescripcion("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>{planInicial ? "Editar Plan" : "Alta de Plan"}</h3>
      <label>Nombre:</label>
      <input
        value={nombre}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
        required
      />
      <label>Descripción:</label>
      <textarea
        value={descripcion}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescripcion(e.target.value)}
        required
      />
      <button type="submit">{planInicial ? "Actualizar" : "Registrar"}</button>
      {onCancel && (
        <button type="button" onClick={onCancel} style={{ marginLeft: "1rem" }}>
          Cancelar
        </button>
      )}
    </form>
  );
};

export default PlanForm;