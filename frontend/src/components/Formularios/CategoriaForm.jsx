import { useState } from "react";

function CategoriaForm() {
  const [nombre, setNombre] = useState("");
  const [maxMaterias, setMaxMaterias] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !maxMaterias) {
      alert("Completar todos los campos.");
      return;
    }

    console.log("Nueva categoría:", { nombre, maxMaterias });
    alert("Categoría registrada correctamente.");
    setNombre(""); setMaxMaterias("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Categoría</h3>
      <label>Nombre:</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

      <label>Máximo de materias:</label>
      <input type="number" value={maxMaterias} onChange={(e) => setMaxMaterias(e.target.value)} />

      <button type="submit">Registrar</button>
    </form>
  );
}

export default CategoriaForm;