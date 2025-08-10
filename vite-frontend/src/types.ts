export interface Plan { nombre: string; descripcion: string; }
export interface Materia { nombre: string; planId: string; anio: string; }
export interface Docente { nombre: string; dni: string; categoriaId: string; }
export interface Cuatrimestre { anio: string; numero: string; activo: boolean; }
export interface Categoria { nombre: string; maxMaterias: string; }
