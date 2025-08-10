import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Cuatrimestre } from "../../types"; // Ajustá la ruta según tu estructura

const CuatrimestreForm: React.FC = () => {
  const [anio, setAnio] = useState<string>("");
  const [numero, setNumero] = useState<string>("");
  const [activo, setActivo] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!anio || !numero) {
      alert("Completá el año y el número del cuatrimestre.");
      return;
    }

    const nuevoCuatrimestre: Cuatrimestre = {
      anio,
      numero,
      activo,
    };

    console.log("Cuatrimestre registrado:", nuevoCuatrimestre);
    alert("Cuatrimestre guardado correctamente.");

    setAnio("");
    setNumero("");
    setActivo(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Cuatrimestre</h3>

      <label>Año:</label>
      <input
        type="number"
        value={anio}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setAnio(e.target.value)}
      />

      <label>Cuatrimestre:</label>
      <select
        value={numero}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setNumero(e.target.value)}
      >
        <option value="">Seleccione</option>
        <option value="1">1°</option>
        <option value="2">2°</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={activo}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setActivo(e.target.checked)}
        />
        ¿Está activo?
      </label>

      <button type="submit">Registrar</button>
    </form>
  );
};

export default CuatrimestreForm;