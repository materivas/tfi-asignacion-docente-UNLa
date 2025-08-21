import { useState, useEffect } from "react";
import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";
import type { Docente, Categoria } from "../../types";
import { listarCategorias } from "../../api/categoriaApi";

const DocenteForm: React.FC = () => {
  const [nombre, setNombre] = useState<string>("");
  const [dni, setDni] = useState<string>("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
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

    if (categoriaId === "") {
      alert("Debe seleccionar una categoría.");
      return;
    }

    const nuevoDocente: Docente = {
      nombre,
      dni,
      categoriaId
    };

    try {
      const response = await axios.post("http://localhost:8080/api/docentes", nuevoDocente, {
        withCredentials: true
      });
      console.log("Docente registrado:", response.data);
      alert("Docente registrado correctamente.");

      setNombre("");
      setDni("");
      setCategoriaId("");
    } catch (error) {
      console.error("Error al registrar el docente:", error);
      alert("Hubo un error al registrar el docente.");
    }
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
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          const value = e.target.value;
          setCategoriaId(value === "" ? "" : Number(value));
        }}
      >
        <option value="">Seleccione</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nombre}
          </option>
        ))}
      </select>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Registrar</button>
    </form>
  );
};

export default DocenteForm;