import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Categoria } from "../../types"; // Ajustá la ruta según tu estructura

const CategoriaForm: React.FC = () => {
  const [nombre, setNombre] = useState<string>("");
  const [maxMaterias, setMaxMaterias] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !maxMaterias) {
      alert("Completar todos los campos.");
      return;
    }

    const nuevaCategoria: Categoria = { nombre, maxMaterias };
    console.log("Nueva categoría:", nuevaCategoria);
    alert("Categoría registrada correctamente.");

    setNombre("");
    setMaxMaterias("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Categoría</h3>

      <label>Nombre:</label>
      <input
        type="text"
        value={nombre}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
      />

      <label>Máximo de materias:</label>
      <input
        type="number"
        value={maxMaterias}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxMaterias(e.target.value)}
      />

      <button type="submit">Registrar</button>
    </form>
  );
};

export default CategoriaForm;
