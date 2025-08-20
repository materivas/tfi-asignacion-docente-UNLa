import { useState } from "react";
import axios from "axios";
import type { ChangeEvent, FormEvent } from "react";
import type { Docente } from "../../types";

const DocenteForm: React.FC = () => {
  const [nombre, setNombre] = useState<string>("");
  const [dni, setDni] = useState<string>("");
  const [categoriaId, setCategoriaId] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setCategoriaId(e.target.value)}
      >
        <option value="">Seleccione</option>
        <option value="1">Titular</option>
        <option value="2">Adjunto</option>
        <option value="3">JTP</option>
        <option value="4">Ayudante</option>
      </select>

      <button type="submit">Registrar</button>
    </form>
  );
};

export default DocenteForm;