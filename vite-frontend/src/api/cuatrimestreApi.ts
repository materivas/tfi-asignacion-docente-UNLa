import axios from 'axios';
import type { Cuatrimestre } from '../types';

const BASE_URL = 'http://localhost:8080/api/cuatrimestres';

export const listarCuatrimestres = () => axios.get<Cuatrimestre[]>(BASE_URL);

export const obtenerCuatrimestre = (id: number) =>
  axios.get<Cuatrimestre>(`${BASE_URL}/${id}`);

export const crearCuatrimestre = (cuatrimestre: Cuatrimestre) =>
  axios.post<Cuatrimestre>(BASE_URL, cuatrimestre, { withCredentials: true });

export const actualizarCuatrimestre = (id: number, cuatrimestre: Cuatrimestre) =>
  axios.put<Cuatrimestre>(`${BASE_URL}/${id}`, cuatrimestre, { withCredentials: true });

export const eliminarCuatrimestre = (id: number) =>
  axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });