import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Categoria } from "../../types";

type Props = {
  categoriaInicial?: Categoria;
  onSubmit: (categoria: Categoria) => void;
  onCancel?: () => void;
};

const CategoriaForm: React.FC<Props> = ({ categoriaInicial, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState("");
  const [maxMaterias, setMaxMaterias] = useState("");

  useEffect(() => {
    if (categoriaInicial) {
      setNombre(categoriaInicial.nombre);
      setMaxMaterias(String(categoriaInicial.maxMaterias));
    }
  }, [categoriaInicial]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !maxMaterias) {
      alert("Completá todos los campos.");
      return;
    }

    const categoriaFinal: Categoria = {
      id: categoriaInicial?.id, // puede ser undefined
      nombre,
      maxMaterias: Number(maxMaterias)
    };

    onSubmit(categoriaFinal);
    setNombre("");
    setMaxMaterias("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>{categoriaInicial ? "Editar Categoría" : "Alta de Categoría"}</h3>

      <label>Nombre:</label>
      <input
        value={nombre}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
        required
      />

      <label>Máximo de materias:</label>
      <input
        type="number"
        value={maxMaterias}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setMaxMaterias(e.target.value)}
        required
      />

      <button type="submit">{categoriaInicial ? "Actualizar" : "Registrar"}</button>

      {onCancel && (
        <button type="button" onClick={onCancel} style={{ marginLeft: "1rem" }}>
          Cancelar
        </button>
      )}
    </form>
  );
};

export default CategoriaForm;