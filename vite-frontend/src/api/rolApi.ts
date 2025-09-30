import axios from "axios";
import type { Rol } from "src/types";

const BASE_URL = 'http://localhost:8080/api/roles';

export const listarRoles = async (): Promise<Rol[]> => {
  const res = await axios.get(BASE_URL);

  return res.data;
};

export const obtenerRolPorId = async (id: number): Promise<Rol> => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};

export const crearRol = async (rol: Omit<Rol, "id"> & Partial<Rol>): Promise<Rol> => {
  const res = await axios.post(BASE_URL, rol);
  return res.data;
};

export const actualizarRol = async (id: number, rol: Partial<Rol>): Promise<Rol> => {
  const res = await axios.put(`${BASE_URL}/${id}`, rol);
  return res.data;
};

export const eliminarRol = async (id: number): Promise<void> => {
  await axios.delete(`${BASE_URL}/${id}`);
};