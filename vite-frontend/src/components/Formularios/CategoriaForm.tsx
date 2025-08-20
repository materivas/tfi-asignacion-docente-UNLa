import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Categoria } from "../../types";
import { crearCategoria } from "../../api/categoriaApi";

const CategoriaForm: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [maxMaterias, setMaxMaterias] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombre || !maxMaterias) {
      alert("Completá todos los campos.");
      return;
    }

    const nuevaCategoria: Categoria = {
      nombre,
      maxMaterias: Number(maxMaterias)
    };

    try {
      const res = await crearCategoria(nuevaCategoria);
      console.log("✅ Categoría registrada:", res.data);
      alert("✅ Categoría guardada con éxito.");
      setNombre("");
      setMaxMaterias("");
    } catch (error) {
      console.error("❌ Error al guardar la categoría:", error);
      alert("❌ Hubo un error al guardar la categoría.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Categoría</h3>
      <label>Nombre:</label>
      <input value={nombre} onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)} required />

      <label>Máximo de materias:</label>
      <input type="number" value={maxMaterias} onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxMaterias(e.target.value)} required />

      <button type="submit">Registrar</button>
    </form>
  );
};

export default CategoriaForm;