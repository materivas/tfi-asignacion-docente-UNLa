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
  const [comision, setComision] = useState<string>(AsignacionInicial?.comision ?? "");
  const [comisionEditada, setComisionEditada] = useState(false);

  const abreviarTurno = (valorTurno: string) => {
    if (!valorTurno) return "";
    const t = valorTurno.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    if (t.includes("manana") || t.includes("maniana")) return "TM";
    if (t.includes("tarde")) return "TT";
    if (t.includes("noche")) return "TN";
    return "";
  };

  const generarComision = (mId: number | "", t: string) => {
    const mat = materias?.find((m) => m.id === Number(mId));
    return mat?.codigo && t ? `${mat.codigo}-1 ${abreviarTurno(t)}` : "";
  };

  const handleMateriaChange = (val: number | "") => {
    setMateriaID(val);
    if (!comisionEditada) setComision(generarComision(val, turno));
  };

  const handleTurnoChange = (val: string) => {
    setTurno(val);
    if (!comisionEditada) setComision(generarComision(materiaId, val));
  };

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
          dia,
          comision: comision || undefined
        }
      : {
          materiaId: Number(materiaId),
          cuatrimestreId: Number(cuatrimestreId),
          turno,
          anio: Number(anio),
          dia,
          comision: comision || undefined
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
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="field">
        <label>Materia</label>
        <select
          value={materiaId}
          onChange={(e) => handleMateriaChange(Number(e.target.value))}
          required
        >
          <option value="">Seleccioná una materia…</option>
          {materias.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Cuatrimestre</label>
        <select
          value={cuatrimestreId}
          onChange={(e) => setCuatrimestreID(Number(e.target.value))}
          required
        >
          <option value="">Seleccioná cuatrimestre…</option>
          {cuatrimestres.map((c) => (
            <option key={c.id} value={c.id}>
              Cuatrimestre {c.numeroCuatri}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Turno</label>
        <select
          value={turno}
          onChange={(e) => handleTurnoChange(e.target.value)}
          required
        >
          <option value="">Seleccioná turno…</option>
          <option value="Maniana">Mañana</option>
          <option value="Tarde">Tarde</option>
          <option value="Noche">Noche</option>
        </select>
      </div>

      <div className="field">
        <label>Comisión</label>
        <input
          type="text"
          value={comision}
          onChange={(e) => { setComision(e.target.value); setComisionEditada(true); }}
          onFocus={() => setComisionEditada(true)}
          placeholder={generarComision(materiaId, turno) || "Ej: 101-1 TM"}
        />
        {comisionEditada && (
          <button
            type="button"
            className="btn-link"
            onClick={() => { setComision(generarComision(materiaId, turno)); setComisionEditada(false); }}
          >
            Restaurar automática
          </button>
        )}
      </div>

      <div className="field">
        <label>Día</label>
        <select
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          required
        >
          <option value="">Seleccioná día…</option>
          <option value="Lunes">Lunes</option>
          <option value="Martes">Martes</option>
          <option value="Miercoles">Miercoles</option>
          <option value="Jueves">Jueves</option>
          <option value="Viernes">Viernes</option>
          <option value="Sabado">Sabado</option>
        </select>
      </div>

      <div className="field">
        <label>Año</label>
        <input
          type="number"
          value={anio}
          onChange={(e) => setAnio(Number(e.target.value))}
          required
          placeholder="Ej: 2025"
        />
      </div>

      <div className="form-actions">
        {AsignacionInicial && onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-submit">
          {AsignacionInicial ? "Guardar cambios" : "Registrar"}
        </button>
      </div>
    </form>
  );
};

export default AsignacionForm;
