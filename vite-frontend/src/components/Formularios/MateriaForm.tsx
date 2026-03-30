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
  const [codigo, setCodigo] = useState<number | "">(materiaInicial?.codigo ?? "");

  if (!planes || !Array.isArray(planes)) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
        Error: No se pudieron cargar los planes académicos.
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
      codigo: codigo ? Number(codigo) : undefined,
      ...(materiaInicial?.id != null && { id: materiaInicial.id })
    };

    if (onSubmit) {
      await onSubmit(materia);
      setNombre("");
      setPlanId("");
      setCodigo("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="field">
        <label>Nombre</label>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          placeholder="Ej: Programación I"
        />
      </div>

      <div className="field">
        <label>Año en la carrera</label>
        <input
          type="number"
          value={anio}
          onChange={(e) => setAnio(Number(e.target.value))}
          required
          placeholder="Ej: 1"
          min={1}
          max={6}
        />
      </div>

      <div className="field">
        <label>Código</label>
        <input
          type="number"
          value={codigo}
          onChange={(e) => setCodigo(Number(e.target.value))}
          placeholder="Ej: 25"
        />
      </div>

      <div className="field">
        <label>Plan académico</label>
        <select
          value={planId}
          onChange={(e) => setPlanId(Number(e.target.value))}
          required
        >
          <option value="">Seleccioná un plan…</option>
          {planes.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        {materiaInicial && onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-submit">
          {materiaInicial ? "Guardar cambios" : "Registrar"}
        </button>
      </div>
    </form>
  );
};

export default MateriaForm;