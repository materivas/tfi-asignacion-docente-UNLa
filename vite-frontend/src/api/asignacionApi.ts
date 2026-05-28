import axios from 'axios';
import type { Asignacion } from '../types';

const BASE_URL = '/api/asignaciones';

const extraerMensajeError = (error: any, fallback: string) => {
  const data = error?.response?.data;

  if (typeof data === "string" && data.trim()) return data;
  if (data?.mensaje) return data.mensaje;
  if (data?.message) return data.message;

  return fallback;
};

const crearErrorApi = (mensaje: string, errorOriginal: any) =>
  Object.assign(new Error(mensaje), {
    mensajeUsuario: mensaje,
    response: errorOriginal?.response,
    originalError: errorOriginal,
  });

export const listarAsignaciones = () => axios.get<Asignacion[]>(BASE_URL);

export const obtenerAsignacion = (id: number) =>
  axios.get<Asignacion>(`${BASE_URL}/${id}`);

export const crearAsignacion = (asignacion: Asignacion) =>
  axios.post<Asignacion>(BASE_URL, asignacion, { withCredentials: true });

export const actualizarAsignacion = async (id: number, asignacion: Asignacion) => {
  try {
    return await axios.put<Asignacion>(`${BASE_URL}/${id}`, asignacion, { withCredentials: true });
  } catch (error: any) {
    if (error.response?.status === 409) {
      const mensaje = extraerMensajeError(error, "No se puede mover la asignacion porque ya existe un conflicto de horarios.");
      throw crearErrorApi(mensaje, error);
    }
    throw crearErrorApi("Error interno del servidor al procesar la asignacion.", error);
  }
};

export const eliminarAsignacion = (id: number) =>
  axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });

export const exportarCalendarioExcel = async (anio?: number | "", cuatrimestre?: number | "") => {
  const params = new URLSearchParams();
  if (anio !== undefined && anio !== "") params.append("anio", String(anio));
  if (cuatrimestre !== undefined && cuatrimestre !== "") params.append("cuatrimestre", String(cuatrimestre));
  const response = await axios.get(`${BASE_URL}/exportar-excel`, {
    params,
    responseType: 'blob',
  });
  // Descargar el archivo
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  const filename = `calendario_docentes${anio ? '_' + anio : ''}.xlsx`;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
