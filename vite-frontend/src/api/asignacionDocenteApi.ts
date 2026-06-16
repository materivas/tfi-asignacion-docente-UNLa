import axios from "axios";
import type { AsignacionDocente } from "../types";

const BASE_URL = "/api/asignaciones-docentes";

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

export const listarAsignacionesDocentes = () =>
  axios.get<AsignacionDocente[]>(BASE_URL);

export const obtenerAsignacionDocente = (id: number) =>
  axios.get<AsignacionDocente>(`${BASE_URL}/${id}`);

export const crearAsignacionDocente = async (asignacionDocente: AsignacionDocente) => {
  try {
    const response = await axios.post<AsignacionDocente>(BASE_URL, asignacionDocente, {
      withCredentials: true
    });
    return response;
  } catch (error: any) {
    // Si el backend responde con un código de conflicto de horarios (409)
    if (error.response && error.response.status === 409) {
      // Se lanza el error con el "mensaje" que se arma en el GlobalExceptionHandler de Java
      const mensaje = extraerMensajeError(error, "No se puede asignar el docente porque ya tiene una materia en ese horario.");
      throw crearErrorApi(mensaje, error);
    }
    throw crearErrorApi("Error interno del servidor al procesar la asignación del docente.", error);

  }
};

export const actualizarAsignacionDocente = async (
  id: number,
  asignacionDocente: AsignacionDocente
) => {
  try {
    const response = await axios.put<AsignacionDocente>(`${BASE_URL}/${id}`, asignacionDocente, { 
      withCredentials: true
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      const mensaje = extraerMensajeError(error, "No se puede actualizar la asignación porque el docente ya tiene una materia en ese horario.");
      throw crearErrorApi(mensaje, error);
    }
    throw crearErrorApi("Error interno del servidor al procesar la actualización de la asignación del docente.", error);
  }
};

export const eliminarAsignacionDocente = (id: number) =>
  axios.delete(`${BASE_URL}/${id}`, { withCredentials: true });

