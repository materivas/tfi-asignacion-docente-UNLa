import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Plan } from "../../types";
import { crearPlan } from "../../api/planApi";

const PlanForm: React.FC = () => {
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nombre || !descripcion) {
      alert("Completá ambos campos.");
      return;
    }

    const nuevoPlan: Plan = { nombre, descripcion };

    try {
      const res = await crearPlan(nuevoPlan);
      console.log("✅ Plan registrado:", res.data);
      alert("✅ Plan guardado con éxito.");
      setNombre("");
      setDescripcion("");
    } catch (error) {
      console.error("❌ Error al guardar el plan:", error);
      alert("❌ Hubo un error al guardar el plan.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Plan</h3>
      <label>Nombre:</label>
      <input
        value={nombre}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
        required
      />
      <label>Descripción:</label>
      <textarea
        value={descripcion}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescripcion(e.target.value)}
        required
      />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default PlanForm;