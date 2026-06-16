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
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="field">
        <label>Nombre</label>
        <input
          value={nombre}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
          required
          placeholder="Ej: Titular"
        />
      </div>

      <div className="field">
        <label>Máximo de materias</label>
        <input
          type="number"
          value={maxMaterias === "" ? "" : String(maxMaterias)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            setMaxMaterias(v === "" ? "" : Number(v));
          }}
          min={0}
          required
          placeholder="Ej: 3"
        />
      </div>

      <div className="form-actions">
        {categoriaInicial && onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-submit">
          {categoriaInicial ? "Guardar cambios" : "Registrar"}
        </button>
      </div>
    </form>
  );
};

export default CategoriaForm;
