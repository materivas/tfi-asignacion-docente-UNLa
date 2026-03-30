import axios from 'axios';
import type { Plan } from '../types';

const BASE_URL = '/api/planes';

export const listarPlanes = () => axios.get<Plan[]>(BASE_URL);
export const obtenerPlan = (id: number) => axios.get<Plan>(`${BASE_URL}/${id}`);
export const crearPlan = (plan: Plan) => axios.post<Plan>(BASE_URL, plan, { withCredentials: true });
export const actualizarPlan = (id: number, plan: Plan) => axios.put<Plan>(`${BASE_URL}/${id}`, plan, { withCredentials: true });
export const eliminarPlan = (id: number) => axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });

