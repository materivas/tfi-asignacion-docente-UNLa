import { useState } from "react";

function CuatrimestreForm() {
  const [anio, setAnio] = useState("");
  const [numero, setNumero] = useState("");
  const [activo, setActivo] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!anio || !numero) return alert("Completar año y número.");

    const cuatrimestre = { anio, numero, activo };
    console.log("Alta cuatrimestre:", cuatrimestre);
    alert("Cuatrimestre registrado.");
    setAnio(""); setNumero(""); setActivo(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Cuatrimestre</h3>
      <label>Año:</label>
      <input type="number" value={anio} onChange={(e) => setAnio(e.target.value)} />

      <label>Cuatrimestre:</label>
      <select value={numero} onChange={(e) => setNumero(e.target.value)}>
        <option value="">Seleccione</option>
        <option value="1">1°</option>
        <option value="2">2°</option>
      </select>

      <label>
        <input
          type="checkbox"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
        />
        ¿Está activo?
      </label>

      <button type="submit">Registrar</button>
    </form>
  );
}

export default CuatrimestreForm;