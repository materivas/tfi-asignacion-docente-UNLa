import axios from 'axios';

export type EntidadAuditada = 'ASIGNACION' | 'ASIGNACION_DOCENTE' | 'DOCENTE' | 'MATERIA';

export interface EventoAuditoria {
  revision: number;
  fecha: string;
  autor: string;
  entidad: EntidadAuditada;
  entidadId: number;
  accion: 'ADD' | 'MOD' | 'DEL';
  estado: Record<string, unknown>;
}

export interface EventoHistorialAsignacion {
  revision: number;
  fecha: string;
  autor: string;
  entidad: EntidadAuditada;
  accion: 'ADD' | 'MOD' | 'DEL';
  estado: Record<string, unknown>;
}

export interface PaginaAuditoria {
  contenido: EventoAuditoria[];
  pagina: number;
  tamanio: number;
  hayMas: boolean;
}

export interface FiltrosAuditoria {
  pagina: number;
  tamanio: number;
  entidad?: EntidadAuditada;
  autor?: string;
}

export const buscarHistorialAuditoria = async (filtros: FiltrosAuditoria) => {
  const response = await axios.get<PaginaAuditoria>('/api/auditoria/historial', { params: filtros });
  return response.data;
};

export const buscarHistorialAsignacion = async (asignacionId: number) => {
  const response = await axios.get<EventoHistorialAsignacion[]>(`/api/asignaciones/${asignacionId}/historial`);
  return response.data;
};
