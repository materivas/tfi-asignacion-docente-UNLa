export interface Plan {
  id?: number;
  nombre: string;
  descripcion: string;
}

export interface Materia {
  id?: number;
  nombre: string;
  planId: number;
  anio: number;
}

export interface Docente { 
  id?: number; 
  nombre: string; 
  dni: string; 
  categoriaId: number; 
}

export interface Cuatrimestre {
  id?: number;
  numeroCuatri: number;
}

export type Categoria = {
  id?: number;
  nombre: string;
  maxMaterias: number;
};

export interface ImportResultado {
  creados: number;
  ignorados: number;
  filasIgnoradas: string[];
  errores: string[];
}

export type Asignacion = {
  id?: number;
  materiaId: number;
  cuatrimestreId: number;
  turno: string;
  anio: number;
  dia: string;
};

export interface AsignacionDocente {
  id?: number;
  asignacionId: number;
  docenteId: number;
  docenteNombre: string; 
  rolId: number;
  horasAsignadas: number;
  confirmado: boolean;
}

export interface  Rol {
  id: number;
  nombre: string;

};
