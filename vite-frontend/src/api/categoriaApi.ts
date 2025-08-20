import axios from 'axios';
import type { Categoria } from '../types';

const BASE_URL = 'http://localhost:8080/api/Categorias';

export const listarCategorias = () => axios.get<Categoria[]>(BASE_URL);

export const obtenerCategoria = (id: number) =>
  axios.get<Categoria>(`${BASE_URL}/${id}`);

export const crearCategoria = (categoria: Categoria) =>
  axios.post<Categoria>(BASE_URL, categoria, { withCredentials: true });

export const actualizarCategoria = (id: number, categoria: Categoria) =>
  axios.put<Categoria>(`${BASE_URL}/${id}`, categoria, { withCredentials: true });

export const eliminarCategoria = (id: number) =>
  axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });