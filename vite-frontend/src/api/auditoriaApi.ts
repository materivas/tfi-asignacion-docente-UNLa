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
  entidad: 'ASIGNACION' | 'ASIGNACION_DOCENTE';
  accion: 'ADD' | 'MOD' | 'DEL';
  estado: Record<string, unknown>;
}

export interface PaginaHistorialAsignacion {
  contenido: EventoHistorialAsignacion[];
  pagina: number;
  tamanio: number;
  hayMas: boolean;
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

export const buscarHistorialAsignacion = async (asignacionId: number, pagina = 0, tamanio = 20) => {
  const response = await axios.get<PaginaHistorialAsignacion>(`/api/asignaciones/${asignacionId}/historial`, {
    params: { pagina, tamanio },
  });
  return response.data;
};
