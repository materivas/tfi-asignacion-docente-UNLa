import { useState } from "react";

function MateriaForm() {
  const [nombre, setNombre] = useState("");
  const [planId, setPlanId] = useState("");
  const [anio, setAnio] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !planId || !anio) {
      alert("Completar todos los campos.");
      return;
    }

    console.log("Materia registrada:", { nombre, planId, anio });
    alert("Materia guardada.");
    setNombre(""); setPlanId(""); setAnio("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Materia</h3>
      <label>Nombre:</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

      <label>Plan académico:</label>
      <select value={planId} onChange={(e) => setPlanId(e.target.value)}>
        <option value="">Seleccione</option>
        <option value="1">Plan 2020</option>
        <option value="2">Plan 2022</option>
      </select>

      <label>Año:</label>
      <input type="number" value={anio} onChange={(e) => setAnio(e.target.value)} />

      <button type="submit">Registrar</button>
    </form>
  );
}

export default MateriaForm;