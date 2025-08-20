import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Materia } from "../../types";
import { crearMateria } from "../../api/materiaApi";

const MateriaForm: React.FC = () => {
  const [nombre, setNombre] = useState("");
  const [planId, setPlanId] = useState("");
  const [anio, setAnio] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombre || !planId || !anio) {
      alert("Completá todos los campos.");
      return;
    }

const nuevaMateria: Materia = {
  nombre,
  planId: Number(planId),
  anio: Number(anio)
};

    try {
      const res = await crearMateria(nuevaMateria);
      console.log("✅ Materia registrada:", res.data);
      alert("✅ Materia guardada con éxito.");
      setNombre("");
      setPlanId("");
      setAnio("");
    } catch (error) {
      console.error("❌ Error al guardar la materia:", error);
      alert("❌ Hubo un error al guardar la materia.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Materia</h3>
      <label>Nombre:</label>
      <input value={nombre} onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)} required />

      <label>Plan académico:</label>
      <select value={planId} onChange={(e: ChangeEvent<HTMLSelectElement>) => setPlanId(e.target.value)} required>
        <option value="">Seleccione</option>
        <option value="1">Plan 2020</option>
        <option value="2">Plan 2022</option>
      </select>

      <label>Año:</label>
      <input type="number" value={anio} onChange={(e: ChangeEvent<HTMLInputElement>) => setAnio(e.target.value)} required />

      <button type="submit">Registrar</button>
    </form>
  );
};

export default MateriaForm;