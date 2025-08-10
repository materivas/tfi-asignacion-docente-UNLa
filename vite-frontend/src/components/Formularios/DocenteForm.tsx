import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Docente } from "../../types"; // Ajustá la ruta según tu estructura

const DocenteForm: React.FC = () => {
  const [nombre, setNombre] = useState<string>("");
  const [dni, setDni] = useState<string>("");
  const [categoriaId, setCategoriaId] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !dni || !categoriaId) {
      alert("Completá todos los campos.");
      return;
    }

    const nuevoDocente: Docente = { nombre, dni, categoriaId };
    console.log("Docente registrado:", nuevoDocente);
    alert("Docente registrado correctamente.");

    setNombre("");
    setDni("");
    setCategoriaId("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Docente</h3>

      <label>Nombre:</label>
      <input
        type="text"
        value={nombre}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
      />

      <label>DNI:</label>
      <input
        type="text"
        value={dni}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDni(e.target.value)}
      />

      <label>Categoría:</label>
      <select
        value={categoriaId}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategoriaId(e.target.value)}
      >
        <option value="">Seleccione</option>
        <option value="1">Titular</option>
        <option value="2">Adjunto</option>
        <option value="3">JTP</option>
        <option value="4">Ayudante</option>
      </select>

      <button type="submit">Registrar</button>
    </form>
  );
};

export default DocenteForm;