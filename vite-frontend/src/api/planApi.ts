import axios from 'axios';
import type { Plan } from '../types';


const BASE_URL = 'http://localhost:8080/api/planes';

export const listarPlanes = () => axios.get<Plan[]>(BASE_URL);
export const obtenerPlan = (id: number) => axios.get<Plan>(`${BASE_URL}/${id}`);
export const crearPlan = (plan: Plan) => axios.post<Plan>(BASE_URL, plan);
export const actualizarPlan = (id: number, plan: Plan) => axios.put<Plan>(`${BASE_URL}/${id}`, plan);
export const eliminarPlan = (id: number) => axios.delete(`${BASE_URL}/${id}`);

