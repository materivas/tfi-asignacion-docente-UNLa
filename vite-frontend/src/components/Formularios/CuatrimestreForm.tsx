import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Cuatrimestre } from "../../types";
import { crearCuatrimestre } from "../../api/cuatrimestreApi";

const CuatrimestreForm: React.FC = () => {
  const [numeroCuatri, setNumeroCuatri] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!numeroCuatri) {
      alert("Completá el número de cuatrimestre.");
      return;
    }

    const nuevoCuatrimestre: Cuatrimestre = {
      numeroCuatri: Number(numeroCuatri)
    };

    try {
      const res = await crearCuatrimestre(nuevoCuatrimestre);
      console.log("✅ Cuatrimestre registrado:", res.data);
      alert("✅ Cuatrimestre guardado con éxito.");
      setNumeroCuatri("");
    } catch (error) {
      console.error("❌ Error al guardar el cuatrimestre:", error);
      alert("❌ Hubo un error al guardar el cuatrimestre.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>Alta de Cuatrimestre</h3>
      <label>Número de cuatrimestre:</label>
      <select
        value={numeroCuatri}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setNumeroCuatri(e.target.value)}
        required
      >
        <option value="">Seleccione</option>
        <option value="1">1°</option>
        <option value="2">2°</option>
      </select>
      <button type="submit">Registrar</button>
    </form>
  );
};

export default CuatrimestreForm;