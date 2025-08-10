import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Materia } from "../../types"; // Asegurate que el tipo esté bien definido

const MateriaForm: React.FC = () => {
  const [nombre, setNombre] = useState<string>("");
  const [planId, setPlanId] = useState<string>("");
  const [anio, setAnio] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!nombre || !planId || !anio) {
      alert("Completar todos los campos.");
      return;
    }

    const nuevaMateria: Materia = { nombre, planId, anio };
    console.log("Materia registrada:", nuevaMateria);
    alert("Materia guardada.");

    setNombre("");
    setPlanId("");
    setAnio("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Materia</h3>

      <label>Nombre:</label>
      <input
        type="text"
        value={nombre}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
      />

      <label>Plan académico:</label>
      <select
        value={planId}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setPlanId(e.target.value)}
      >
        <option value="">Seleccione</option>
        <option value="1">Plan 2020</option>
        <option value="2">Plan 2022</option>
      </select>

      <label>Año:</label>
      <input
        type="number"
        value={anio}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setAnio(e.target.value)}
      />

      <button type="submit">Registrar</button>
    </form>
  );
};

export default MateriaForm;