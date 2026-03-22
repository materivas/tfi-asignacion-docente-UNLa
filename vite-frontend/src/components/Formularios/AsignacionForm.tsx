import { useState } from "react";
import type { FormEvent } from "react";
import type { Asignacion, Materia, Cuatrimestre } from "../../types";

interface Props {
  materias: Pick<Materia, "id" | "nombre" | "codigo">[] | undefined;
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
  const [dia, setDia] = useState<string>(AsignacionInicial?.dia ?? "");

  const materiaSel = materias?.find((m) => m.id === Number(materiaId));
  const abreviarTurno = (valorTurno: string) => {
    if (!valorTurno) return "";

    const turnoNormalizado = valorTurno
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    if (turnoNormalizado.includes("manana") || turnoNormalizado.includes("maniana")) return "TM";
    if (turnoNormalizado.includes("tarde")) return "TT";
    if (turnoNormalizado.includes("noche")) return "TN";
    return "";
  };

  const comisionPreview = materiaSel?.codigo && turno
    ? `${materiaSel.codigo}-1 ${abreviarTurno(turno)}`
    : "-";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!materiaId || !cuatrimestreId || turno === "" || anio === "" || dia === "") {
      alert("Completa todos los campos.");
      return;
    }

    const nuevaAsignacion: Asignacion = AsignacionInicial?.id
      ? {
          id: AsignacionInicial.id,
          materiaId: Number(materiaId),
          cuatrimestreId: Number(cuatrimestreId),
          turno,
          anio: Number(anio),
          dia
        }
      : {
          materiaId: Number(materiaId),
          cuatrimestreId: Number(cuatrimestreId),
          turno,
          anio: Number(anio),
          dia
        };

    onSubmit?.(nuevaAsignacion);
  };

  if (!materias || !cuatrimestres) {
    return (
      <p style={{ color: "red", textAlign: "center", marginTop: "2rem" }}>
        Error: No se pudieron cargar las materias o cuatrimestres.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h3 style={{ textAlign: "center" }}>
        {AsignacionInicial ? "Editar Asignacion" : "Alta de Asignacion"}
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

      <label>Comision (generada automaticamente):</label>
      <div
        style={{
          display: "block",
          width: "100%",
          padding: "0.5rem",
          marginBottom: "1rem",
          borderRadius: "4px",
          border: "1px solid #ddd",
          backgroundColor: "#f5f5f5",
          fontWeight: "600",
          color: "#333"
        }}
      >
        {comisionPreview}
      </div>

      <label>Dia:</label>
      <select
        value={dia}
        onChange={(e) => setDia(e.target.value)}
        required
        style={inputEstilo}
      >
        <option value="">Seleccione</option>
        <option value="Lunes">Lunes</option>
        <option value="Martes">Martes</option>
        <option value="Miercoles">Miercoles</option>
        <option value="Jueves">Jueves</option>
        <option value="Viernes">Viernes</option>
        <option value="Sabado">Sabado</option>
      </select>

      <label>Anio:</label>
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
          Cancelar edicion
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
