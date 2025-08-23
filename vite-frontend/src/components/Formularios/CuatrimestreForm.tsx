import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { Cuatrimestre } from "../../types";
import { crearCuatrimestre } from "../../api/cuatrimestreApi";

type Props = {
  cuatrimestreInicial?: Cuatrimestre;
  onSubmit?: (cuatrimestre: Cuatrimestre) => void;
};

const CuatrimestreForm: React.FC<Props> = ({ cuatrimestreInicial, onSubmit }) => {
  const [numeroCuatri, setNumeroCuatri] = useState("");
  // const [anio, setAnio] = useState("");

  useEffect(() => {
    if (cuatrimestreInicial) {
      setNumeroCuatri(String(cuatrimestreInicial.numeroCuatri));
      // setAnio(String(cuatrimestreInicial.anio));
    }
  }, [cuatrimestreInicial]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!numeroCuatri /* || !anio */) {
      alert("Completá todos los campos.");
      return;
    }

    const nuevoCuatrimestre: Cuatrimestre = {
      id: cuatrimestreInicial?.id,
      numeroCuatri: Number(numeroCuatri),
      // anio: Number(anio)
    };

    try {
      if (onSubmit) {
        onSubmit(nuevoCuatrimestre);
      } else {
        const res = await crearCuatrimestre(nuevoCuatrimestre);
        console.log("✅ Cuatrimestre registrado:", res.data);
        alert("✅ Cuatrimestre guardado con éxito.");
      }

      setNumeroCuatri("");
      // setAnio("");
    } catch (error) {
      console.error("❌ Error al guardar el cuatrimestre:", error);
      alert("❌ Hubo un error al guardar el cuatrimestre.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "auto" }}>
      <h3>{cuatrimestreInicial ? "Editar Cuatrimestre" : "Alta de Cuatrimestre"}</h3>

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

      {/* 
      <label>Año lectivo:</label>
      <input
        type="number"
        value={anio}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setAnio(e.target.value)}
        required
        min={2020}
        max={2030}
        placeholder="Ej: 2025"
      />
      */}

      <button type="submit">{cuatrimestreInicial ? "Actualizar" : "Registrar"}</button>
    </form>
  );
};

export default CuatrimestreForm;