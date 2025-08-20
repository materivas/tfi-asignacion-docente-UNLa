import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Docente {
  nombre: string;
  apellido: string;
  email: string;
  dni: string;
  titulo: string;
}

const AltaDocente = () => {
  const [formData, setFormData] = useState<Docente>({
    nombre: '',
    apellido: '',
    email: '',
    dni: '',
    titulo: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!formData.nombre || !formData.apellido || !formData.email) {
      alert('Nombre, apellido y email son obligatorios');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/docentes', formData, {
        withCredentials: true
      });
      console.log('Docente creado:', response.data);
      // Podés limpiar el formulario o mostrar feedback visual
    } catch (error) {
      console.error('Error al crear el docente:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nombre"
        value={formData.nombre}
        onChange={handleChange}
        placeholder="Nombre"
      />
      <input
        type="text"
        name="apellido"
        value={formData.apellido}
        onChange={handleChange}
        placeholder="Apellido"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="text"
        name="dni"
        value={formData.dni}
        onChange={handleChange}
        placeholder="DNI"
      />
      <input
        type="text"
        name="titulo"
        value={formData.titulo}
        onChange={handleChange}
        placeholder="Título académico"
      />
      <button type="submit">Guardar docente</button>
    </form>
  );
};

export default AltaDocente;