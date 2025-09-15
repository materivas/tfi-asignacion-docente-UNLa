import axios from 'axios';
import type { Asignacion } from '../types';

const BASE_URL = 'http://localhost:8080/api/asignaciones';

export const listarAsignaciones = () => axios.get<Asignacion[]>(BASE_URL);

export const obtenerAsignacion = (id: number) =>
  axios.get<Asignacion>(`${BASE_URL}/${id}`);

export const crearAsignacion = (Asignacion: Asignacion) =>
  axios.post<Asignacion>(BASE_URL, Asignacion, { withCredentials: true });

export const actualizarAsignacion = (id: number, Asignacion: Asignacion) =>
  axios.put<Asignacion>(`${BASE_URL}/${id}`, Asignacion, { withCredentials: true });

export const eliminarAsignacion = (id: number) =>
  axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });