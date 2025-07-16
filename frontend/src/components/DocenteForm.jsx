import { useState } from "react";

function DocenteForm() {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [rol, setRol] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !dni || !rol) return alert("Completar todos los campos.");

    const docente = { nombre, dni, rol };
    console.log("Alta docente:", docente);
    alert("Docente registrado.");
    setNombre(""); setDni(""); setRol("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Docente</h3>
      <label>Nombre:</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

      <label>DNI:</label>
      <input value={dni} onChange={(e) => setDni(e.target.value)} />

      <label>Rol:</label>
      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="">Seleccione</option>
        <option value="Titular">Titular</option>
        <option value="Adjunto">Adjunto</option>
        <option value="JTP">JTP</option>
        <option value="Ayudante">Ayudante</option>
      </select>

      <button type="submit">Registrar</button>
    </form>
  );
}

export default DocenteForm;