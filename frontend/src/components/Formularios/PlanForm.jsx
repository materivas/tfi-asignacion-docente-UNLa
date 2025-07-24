import { useState } from "react";

function PlanForm() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !descripcion) {
      alert("Completá ambos campos.");
      return;
    }

    console.log("Plan registrado:", { nombre, descripcion });
    alert("Plan guardado.");
    setNombre(""); setDescripcion("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Plan</h3>
      <label>Nombre:</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
      
      <label>Descripción:</label>
      <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

      <button type="submit">Registrar</button>
    </form>
  );
}

export default PlanForm;