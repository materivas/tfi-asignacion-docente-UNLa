import axios from "axios";
import type { AsignacionDocente } from "../types";

const BASE_URL = "http://localhost:8080/api/asignaciones-docentes";

export const listarAsignacionesDocentes = () =>
  axios.get<AsignacionDocente[]>(BASE_URL);

export const obtenerAsignacionDocente = (id: number) =>
  axios.get<AsignacionDocente>(`${BASE_URL}/${id}`);

export const crearAsignacionDocente = (asignacionDocente: AsignacionDocente) =>
  axios.post<AsignacionDocente>(BASE_URL, asignacionDocente, {
    withCredentials: true
  });

export const actualizarAsignacionDocente = (
  id: number,
  asignacionDocente: AsignacionDocente
) =>
  axios.put<AsignacionDocente>(`${BASE_URL}/${id}`, asignacionDocente, {
    withCredentials: true
  });

export const eliminarAsignacionDocente = (id: number) =>
  axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });