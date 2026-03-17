import axios from "axios";
import type { Docente, ImportResultado } from "../types"; 

const BASE_URL = "http://localhost:8080/api/docentes";

export const crearDocente = async (docente: Docente): Promise<Docente> => {
  const response = await axios.post(BASE_URL, docente, {
    withCredentials: true
  });

  return response.data;
};
export const listarDocentes = async (): Promise<Docente[]> => {
  const response = await axios.get(BASE_URL, {
    withCredentials: true
  });
  return response.data;
};

export const eliminarDocente = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`, {
    withCredentials: true
  });
};
export const actualizarDocente = async (id: number, docente: Docente): Promise<Docente> => {
  const response = await axios.put(`${BASE_URL}/${id}`, docente, {
    withCredentials: true
  });
  return response.data;
};

export const importarDocentesExcel = async (archivo: File): Promise<ImportResultado> => {
  const formData = new FormData();
  formData.append('archivo', archivo);
  const response = await axios.post<ImportResultado>(
    `${BASE_URL}/importar-excel`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
  );
  return response.data;
};

