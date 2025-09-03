import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Categoria } from "../../types";

interface Props {
  categoriaInicial?: Categoria;
  onSubmit?: (categoria: Categoria) => void | Promise<void>;
  onCancel?: () => void;
}

const CategoriaForm: React.FC<Props> = ({ categoriaInicial, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState<string>(categoriaInicial?.nombre ?? "");
  const [maxMaterias, setMaxMaterias] = useState<number | "">(categoriaInicial?.maxMaterias ?? "");

  useEffect(() => {
    if (categoriaInicial) {
      setNombre(categoriaInicial.nombre ?? "");
      setMaxMaterias(categoriaInicial.maxMaterias ?? "");
    } else {
      setNombre("");
      setMaxMaterias("");
    }
  }, [categoriaInicial]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || maxMaterias === "") {
      alert("Completá todos los campos.");
      return;
    }

    const payload: Categoria = {
      ...(categoriaInicial?.id != null && { id: categoriaInicial.id }),
      nombre,
      maxMaterias: Number(maxMaterias),
    };

    if (onSubmit) {
      await onSubmit(payload);
      // reset solo en alta
      if (!categoriaInicial) {
        setNombre("");
        setMaxMaterias("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h3 style={{ textAlign: "center" }}>
        {categoriaInicial ? "Editar Categoría" : "Alta de Categoría"}
      </h3>

      <label>Nombre:</label>
      <input
        value={nombre}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
        required
        style={inputEstilo}
        placeholder="Ej: Titular"
      />

      <label>Máximo de materias:</label>
      <input
        type="number"
        value={maxMaterias === "" ? "" : String(maxMaterias)}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          const v = e.target.value;
          setMaxMaterias(v === "" ? "" : Number(v));
        }}
        min={0}
        required
        style={inputEstilo}
        placeholder="Ej: 3"
      />

      <button type="submit" style={btnEstilo}>
        {categoriaInicial ? "Guardar cambios" : "Registrar"}
      </button>

      {categoriaInicial && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          style={{ ...btnEstilo, backgroundColor: "#999", marginTop: "0.5rem" }}
        >
          Cancelar edición
        </button>
      )}
    </form>
  );
};

const inputEstilo: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: "0.5rem",
  marginBottom: "1rem",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const btnEstilo: React.CSSProperties = {
  backgroundColor: "#7A1F1F",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
  width: "100%",
};

export default CategoriaForm;
