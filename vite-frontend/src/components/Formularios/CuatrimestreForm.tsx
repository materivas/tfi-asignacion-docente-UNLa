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
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h3 style={{ textAlign: "center" }}>
        {cuatrimestreInicial ? "Editar Cuatrimestre" : "Alta de Cuatrimestre"}
      </h3>

      <label>Número de cuatrimestre:</label>
      <select
        value={numeroCuatri === "" ? "" : String(numeroCuatri)}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          const val = e.target.value === "" ? "" : Number(e.target.value);
          setNumeroCuatri(val);
        }}
        required
        style={inputEstilo}
      >
        <option value="">Seleccione</option>
        <option value="1">1°</option>
        <option value="2">2°</option>
      </select>

      {/* Si agregás año, copiá el estilo del MateriaForm */}
      {/*
      <label>Año lectivo:</label>
      <input
        type="number"
        value={anio}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const v = e.target.value;
          setAnio(v === "" ? "" : Number(v));
        }}
        required
        min={2020}
        max={2035}
        placeholder="Ej: 2025"
        style={inputEstilo}
      />
      */}

      <button type="submit" style={btnEstilo}>
        {cuatrimestreInicial ? "Guardar cambios" : "Registrar"}
      </button>

      {cuatrimestreInicial && onCancel && (
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

export default CuatrimestreForm;