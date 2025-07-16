import { useState } from "react";

function MateriaForm() {
  const [nombre, setNombre] = useState("");
  const [plan, setPlan] = useState("");
  const [anio, setAnio] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !plan || !anio) return alert("Completar todos los campos.");

    const materia = { nombre, plan, anio };
    console.log("Alta materia:", materia);
    alert("Materia registrada.");
    setNombre(""); setPlan(""); setAnio("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Materia</h3>
      <label>Nombre:</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

      <label>Plan:</label>
      <input value={plan} onChange={(e) => setPlan(e.target.value)} />

      <label>Año:</label>
      <input type="number" value={anio} onChange={(e) => setAnio(e.target.value)} />

      <button type="submit">Registrar</button>
    </form>
  );
}

export default MateriaForm;