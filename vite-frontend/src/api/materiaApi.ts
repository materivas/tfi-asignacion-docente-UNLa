import axios from 'axios';
import type { Materia, ImportResultado } from '../types';

const BASE_URL = '/api/materias';

export const listarMaterias = () => axios.get<Materia[]>(BASE_URL);

export const obtenerMateria = (id: number) =>
  axios.get<Materia>(`${BASE_URL}/${id}`);

export const crearMateria = (materia: Materia) =>
  axios.post<Materia>(BASE_URL, materia, { withCredentials: true });

export const actualizarMateria = (id: number, materia: Materia) =>
  axios.put<Materia>(`${BASE_URL}/${id}`, materia, { withCredentials: true });

export const eliminarMateria = (id: number) =>
  axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });

export const importarMateriasExcel = async (archivo: File): Promise<ImportResultado> => {
  const formData = new FormData();
  formData.append('archivo', archivo);
  const response = await axios.post<ImportResultado>(
    `${BASE_URL}/importar-excel`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true }
  );
  return response.data;
};