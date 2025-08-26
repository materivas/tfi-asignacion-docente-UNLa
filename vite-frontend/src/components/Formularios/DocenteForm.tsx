import { useState, useEffect } from "react";
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
        setError("❌ No se pudieron cargar las categorías.");
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
      categoriaId: Number(categoriaId),
      ...(docenteInicial?.id != null && { id: docenteInicial.id })
    };

    if (onSubmit) {
      await onSubmit(docente);
      setNombre("");
      setDni("");
      setCategoriaId("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "2rem auto" }}>
      <h3 style={{ textAlign: "center" }}>
        {docenteInicial ? "Editar Docente" : "Alta de Docente"}
      </h3>

      <label>Nombre:</label>
      <input
        type="text"
        value={nombre}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
        required
        style={inputEstilo}
      />

      <label>DNI:</label>
      <input
        type="text"
        value={dni}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setDni(e.target.value)}
        required
        style={inputEstilo}
      />

      <label>Categoría:</label>
      <select
        value={categoriaId}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          const value = e.target.value;
          setCategoriaId(value === "" ? "" : Number(value));
        }}
        required
        style={inputEstilo}
      >
        <option value="">Seleccione</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nombre}
          </option>
        ))}
      </select>

      {error && <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>{error}</p>}

      <button type="submit" style={btnEstilo}>
        {docenteInicial ? "Guardar cambios" : "Registrar"}
      </button>

      {docenteInicial && onCancel && (
        <button
          type="button"
          onClick={onCancel}
          style={{
            ...btnEstilo,
            backgroundColor: "#999",
            marginTop: "0.5rem"
          }}
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
  border: "1px solid #ccc"
};

const btnEstilo: React.CSSProperties = {
  backgroundColor: "#7A1F1F",
  color: "white",
  padding: "0.5rem 1rem",
  borderRadius: "6px",
  fontWeight: "bold",
  border: "none",
  cursor: "pointer",
  width: "100%"
};

export default DocenteForm;