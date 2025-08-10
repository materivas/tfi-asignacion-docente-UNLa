import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Plan } from "../../types";


const PlanForm: React.FC = () => {
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombre || !descripcion) {
      alert("Completá ambos campos.");
      return;
    }

    const nuevoPlan: Plan = { nombre, descripcion };
    console.log("Plan registrado:", nuevoPlan);
    alert("Plan guardado.");
    setNombre(""); setDescripcion("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Plan</h3>
      <label>Nombre:</label>
      <input value={nombre} onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)} />
      <label>Descripción:</label>
      <textarea value={descripcion} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescripcion(e.target.value)} />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default PlanForm;