import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Docente, Categoria } from "../../types";
import { listarCategorias } from "../../api/categoriaApi";

interface Props {
  docenteInicial?: Docente;
  onSubmit?: (docente: Docente) => void;
  onCancel?: () => void;
}

const DocenteForm: React.FC<Props> = ({ docenteInicial, onSubmit, onCancel }) => {
  const [nombre, setNombre] = useState(docenteInicial?.nombre ?? "");
  const [dni, setDni] = useState(docenteInicial?.dni ?? "");
  const [email, setEmail] = useState(docenteInicial?.email ?? "");
  const [categoriaId, setCategoriaId] = useState<number | "">(docenteInicial?.categoriaId ?? "");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await listarCategorias();
        setCategorias(res.data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        setError("No se pudieron cargar las categorías.");
      }
    };

    fetchCategorias();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !dni || categoriaId === "") {
      alert("Completá todos los campos.");
      return;
    }

    const docente: Docente = {
      nombre,
      dni,
      email, // <-- Se envía el email al backend
      categoriaId: Number(categoriaId),
      ...(docenteInicial?.id != null && { id: docenteInicial.id })
    };

    if (onSubmit) {
      await onSubmit(docente);
      setNombre("");
      setDni("");
      setEmail(""); // <-- Limpiar el campo
      setCategoriaId("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      <div className="field">
        <label>Nombre completo</label>
        <input
          type="text"
          value={nombre}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
          required
          placeholder="Ej: Juan Pérez"
        />
      </div>

      <div className="field">
        <label>DNI</label>
        <input
          type="text"
          value={dni}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setDni(e.target.value)}
          required
          placeholder="Ej: 30123456"
        />
      </div>

      {/* NUEVO CAMPO VISUAL DEL EMAIL */}
      <div className="field">
        <label>Email (Opcional)</label>
        <input
            type="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            placeholder="Ej: correo@unla.edu.ar"
        />
      </div>
      {/* FIN DEL NUEVO CAMPO */}

      <div className="field">
        <label>Categoría</label>
        <select
          value={categoriaId}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => {
            const value = e.target.value;
            setCategoriaId(value === "" ? "" : Number(value));
          }}
          required
        >
          <option value="">Seleccioná una categoría…</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-actions">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-cancel">
            Cancelar
          </button>
        )}
        <button type="submit" className="btn-submit">
          {docenteInicial ? "Guardar cambios" : "Registrar"}
        </button>
      </div>
    </form>
  );
};

export default DocenteForm;