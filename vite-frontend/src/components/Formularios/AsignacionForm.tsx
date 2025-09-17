import { useState } from "react";
import type { FormEvent } from "react";
import type { Asignacion, Materia, Cuatrimestre } from "../../types";

interface Props {
  materias: Pick<Materia, "id" | "nombre">[] | undefined;
  cuatrimestres: Pick<Cuatrimestre, "id" | "numeroCuatri">[] | undefined;
  AsignacionInicial?: Asignacion;
  onSubmit?: (asignacion: Asignacion) => void;
  onCancel?: () => void;
}

const AsignacionForm: React.FC<Props> = ({
  materias,
  cuatrimestres,
  AsignacionInicial,
  onSubmit,
  onCancel
}) => {
  const [materiaId, setMateriaID] = useState<number | "">(AsignacionInicial?.materiaId ?? "");
  const [cuatrimestreId, setCuatrimestreID] = useState<number | "">(AsignacionInicial?.cuatrimestreId ?? "");
  const [turno, setTurno] = useState<string>(AsignacionInicial?.turno ?? "");
  const [anio, setAnio] = useState<number | "">(AsignacionInicial?.anio ?? "");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!materiaId || !cuatrimestreId || turno === "" || anio === "") {
      alert("Completá todos los campos.");
      return;
    }

    const nuevaAsignacion: Asignacion = {
      materiaId: Number(materiaId),
      cuatrimestreId: Number(cuatrimestreId),
      turno,
      anio: Number(anio),
      ...(AsignacionInicial?.id && { id: AsignacionInicial.id })
    };

    onSubmit?.(nuevaAsignacion);
  };

  if (!materias || !cuatrimestres) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
        ❌ Error: No se pudieron cargar las materias o cuatrimestres.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h3 style={{ textAlign: "center" }}>
        {AsignacionInicial ? "Editar Asignación" : "Alta de Asignación"}
      </h3>

      <label>Materia:</label>
      <select
        value={materiaId}
        onChange={(e) => setMateriaID(Number(e.target.value))}
        required
        style={inputEstilo}
      >
        <option value="">Seleccione</option>
        {materias.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nombre}
          </option>
        ))}
      </select>

      <label>Cuatrimestre:</label>
      <select
        value={cuatrimestreId}
        onChange={(e) => setCuatrimestreID(Number(e.target.value))}
        required
        style={inputEstilo}
      >
        <option value="">Seleccione</option>
        {cuatrimestres.map((c) => (
          <option key={c.id} value={c.id}>
            Cuatrimestre {c.numeroCuatri}
          </option>
        ))}
      </select>

      <label>Turno:</label>
      <select
        value={turno}
        onChange={(e) => setTurno(e.target.value)}
        required
        style={inputEstilo}
      >
        <option value="">Seleccione</option>
        <option value="Mañana">Mañana</option>
        <option value="Tarde">Tarde</option>
        <option value="Noche">Noche</option>
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
        {AsignacionInicial ? "Guardar cambios" : "Registrar"}
      </button>

      {AsignacionInicial && onCancel && (
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

export default AsignacionForm;