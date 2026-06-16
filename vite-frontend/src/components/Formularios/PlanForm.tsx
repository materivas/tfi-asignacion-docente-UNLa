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
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="field">
        <label>Nombre</label>
        <input
          value={nombre}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
          required
          placeholder="Ej: Plan 2025"
        />
      </div>

      <div className="field">
        <label>Descripción</label>
        <textarea
          value={descripcion}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescripcion(e.target.value)}
          required
          placeholder="Resumen del plan académico…"
          style={{ minHeight: "5rem", resize: "vertical" }}
        />
      </div>

      <div className="form-actions">
        {planInicial && onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-submit">
          {planInicial ? "Guardar cambios" : "Registrar"}
        </button>
      </div>
    </form>
  );
};

export default PlanForm;
