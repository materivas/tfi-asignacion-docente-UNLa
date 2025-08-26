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



