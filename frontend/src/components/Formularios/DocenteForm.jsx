import { useState } from "react";

function DocenteForm() {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !dni || !categoriaId) {
      alert("Completá todos los campos.");
      return;
    }

    const docente = { nombre, dni, categoriaId };
    console.log("Docente registrado:", docente);
    alert("Docente registrado correctamente.");
    setNombre(""); setDni(""); setCategoriaId("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Docente</h3>
      <label>Nombre:</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

      <label>DNI:</label>
      <input value={dni} onChange={(e) => setDni(e.target.value)} />

      <label>Categoría:</label>
      <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)}>
        <option value="">Seleccione</option>
        <option value="1">Titular</option>
        <option value="2">Adjunto</option>
        <option value="3">JTP</option>
        <option value="4">Ayudante</option>
      </select>

      <button type="submit">Registrar</button>
    </form>
  );
}

export default DocenteForm;