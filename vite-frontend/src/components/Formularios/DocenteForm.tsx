import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Docente, Categoria } from "../../types";
import { listarCategorias } from "../../api/categoriaApi";

// DOC: [HU-2.1] Regex de validación de email alineado con el estándar RFC 5322 simplificado.
// Se valida en frontend como primera línea de defensa; el backend aplica @Email como segunda.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [emailError, setEmailError] = useState<string | null>(null);

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

  // DOC: [HU-2.1] Validación de formato en tiempo real para dar feedback inmediato al usuario.
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setEmail(valor);
    if (valor && !EMAIL_REGEX.test(valor)) {
      setEmailError("El formato del email no es válido");
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // DOC: [HU-2.1] Agregado de validación de obligatoriedad del email antes de enviar al backend.
    if (!nombre || !dni || !email || categoriaId === "") {
      alert("Completá todos los campos.");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setEmailError("El formato del email no es válido.");
      return;
    }

    const docente: Docente = {
      nombre,
      dni,
      email,
      categoriaId: Number(categoriaId),
      ...(docenteInicial?.id != null && { id: docenteInicial.id })
    };

    if (onSubmit) {
      await onSubmit(docente);
      setNombre("");
      setDni("");
      setEmail(""); // <-- Limpiar el campo
      setCategoriaId("");
      setEmailError(null); // <-- Limpiar el error de email
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

      {/* DOC: [HU-2.1] Campo email obligatorio. Actúa como username del Usuario generado automáticamente. */}
      <div className="field">
        <label>Email institucional</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          required
          placeholder="Ej: correo@unla.edu.ar"
        />
        {emailError && <span className="field-error">{emailError}</span>}
      </div>

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