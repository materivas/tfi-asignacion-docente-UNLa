import React, { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Docente, Categoria } from "../../types";
import { listarCategorias } from "../../api/categoriaApi";

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
  const [dedicacion, setDedicacion] = useState(docenteInicial?.dedicacion ?? "");
  const [concursado, setConcursado] = useState(docenteInicial?.concursado ?? false);

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

    if (!nombre || !dni || !email || categoriaId === "" || dedicacion === "") {
      alert("Completá todos los campos obligatorios.");
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
      dedicacion,
      concursado,
      ...(docenteInicial?.id != null && { id: docenteInicial.id })
    };

    if (onSubmit) {
      await onSubmit(docente);
      setNombre("");
      setDni("");
      setEmail("");
      setCategoriaId("");
      setDedicacion("");
      setConcursado(false);
      setEmailError(null);
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

        <div className="field">
          <label>Dedicación Horaria</label>
          <select
              value={dedicacion}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setDedicacion(e.target.value)}
              required
          >
            <option value="">Seleccioná una dedicación…</option>
            <option value="SIMPLE">Simple</option>
            <option value="SEMI_EXCLUSIVA">Semi-Exclusiva</option>
            <option value="EXCLUSIVA">Exclusiva</option>
          </select>
        </div>

        <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          <input
              type="checkbox"
              id="concursado"
              checked={concursado}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConcursado(e.target.checked)}
              style={{ width: 'auto', cursor: 'pointer' }}
          />
          <label htmlFor="concursado" style={{ margin: 0, cursor: 'pointer', fontWeight: 500 }}>
            Docente por Concurso Público
          </label>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-actions">
          {onCancel && (
              <button type="button" onClick2={onCancel} className="btn-cancel" onClick={onCancel}>
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