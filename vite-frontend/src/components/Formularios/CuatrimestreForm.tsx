import { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import type { Cuatrimestre } from "../../types";

interface Props {
  cuatrimestreInicial?: Cuatrimestre;
  onSubmit?: (cuatrimestre: Cuatrimestre) => void | Promise<void>;
  onCancel?: () => void;
}

const CuatrimestreForm: React.FC<Props> = ({ cuatrimestreInicial, onSubmit, onCancel }) => {
  // mantenemos el mismo enfoque que MateriaForm: estados "number | ''"
  const [numeroCuatri, setNumeroCuatri] = useState<number | "">(cuatrimestreInicial?.numeroCuatri ?? "");
  // si luego agregás año, podés replicar este patrón:
  // const [anio, setAnio] = useState<number | "">(cuatrimestreInicial?.anio ?? "");

  useEffect(() => {
    if (cuatrimestreInicial) {
      setNumeroCuatri(cuatrimestreInicial.numeroCuatri ?? "");
      // setAnio(cuatrimestreInicial.anio ?? "");
    } else {
      setNumeroCuatri("");
      // setAnio("");
    }
  }, [cuatrimestreInicial]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (numeroCuatri === "" /* || anio === "" */) {
      alert("Completá todos los campos.");
      return;
    }

    const payload: Cuatrimestre = {
      ...(cuatrimestreInicial?.id != null && { id: cuatrimestreInicial.id }),
      numeroCuatri: Number(numeroCuatri),
      // anio: Number(anio),
    };

    if (onSubmit) {
      await onSubmit(payload);
      // reseteo solo en alta; si estás editando normalmente cerrás con onCancel
      if (!cuatrimestreInicial) {
        setNumeroCuatri("");
        // setAnio("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="field">
        <label>Número de cuatrimestre</label>
        <select
          value={numeroCuatri === "" ? "" : String(numeroCuatri)}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            const val = e.target.value === "" ? "" : Number(e.target.value);
            setNumeroCuatri(val);
          }}
          required
        >
          <option value="">Seleccioná cuatrimestre…</option>
          <option value="1">1°</option>
          <option value="2">2°</option>
        </select>
      </div>

      <div className="form-actions">
        {cuatrimestreInicial && onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-submit">
          {cuatrimestreInicial ? "Guardar cambios" : "Registrar"}
        </button>
      </div>
    </form>
  );
};

export default CuatrimestreForm;