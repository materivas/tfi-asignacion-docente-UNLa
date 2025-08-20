export interface Plan {
  id?: number;
  nombre: string;
  descripcion: string;
}
export interface Materia {
  nombre: string;
  planId: number;
  anio: number;
}
export interface Docente { nombre: string; dni: string; categoriaId: string; }
export interface Cuatrimestre {
  numeroCuatri: number;
}
export interface Categoria { nombre: string; maxMaterias: number; }
