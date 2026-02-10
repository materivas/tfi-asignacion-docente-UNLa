# 🎓 Sistema de Gestión Docente - Universidad Nacional de Lanús

## 📋 Descripción del Proyecto

Sistema web profesional de Gestión de Docentes y Materias desarrollado como Trabajo Final Integrador de la Licenciatura en Sistemas de la Universidad Nacional de Lanús (UNLa).

El sistema permite al Director de carrera administrar de manera integral:
- **Docentes** con categorías académicas
- **Materias** organizadas por planes de estudio
- **Asignaciones** de docentes a materias con roles específicos
- **Organización académica** por ciclos, años y cuatrimestres

---

## 🏗️ Arquitectura del Sistema

### Backend
- **Framework**: Spring Boot 3.5.3
- **Lenguaje**: Java 17
- **Base de Datos**: PostgreSQL / H2 (desarrollo)
- **ORM**: Spring Data JPA
- **API**: RESTful con OpenAPI/Swagger
- **Validación**: Spring Validation

### Frontend
- **Framework**: React 19.1.0 con TypeScript
- **Build Tool**: Vite 6.3.3
- **Routing**: React Router DOM 7.8.0
- **Estilos**: Tailwind CSS 4.1.4 + CSS Variables
- **HTTP Client**: Axios 1.11.0

---

## 🎨 Sistema de Diseño

### Paleta de Colores Institucional

- **Rojo UNLa**: `#7A1F1F` (Color principal)
- **Azul Académico**: `#1F5A7A` (Color secundario)
- **Blancos y Grises**: Escala profesional para fondos y textos
- **Estados**: Verde (#059669), Amarillo (#D97706), Rojo (#DC2626)

Ver documentación completa en [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md)

---

## 📦 Modelo de Datos

### Entidades Principales

1. **Docente** - Nombre, DNI, Categoría académica
2. **Materia** - Nombre, Plan de estudio, Año académico
3. **Asignación** - Materia, Cuatrimestre, Año lectivo, Turno
4. **AsignacionDocente** - Asignación + Docente + Rol + Horas
5. **Categoría** - Nombre, Máximo de materias
6. **Plan** - Nombre, Descripción, Ciclos
7. **Cuatrimestre** - Número (1° o 2°)

---

## 🚀 Funcionalidades Implementadas

### ✅ Gestión de Docentes
- CRUD completo con validaciones
- Filtrado por nombre, DNI y categoría
- Búsqueda en tiempo real
- Vista tabular profesional

### ✅ Gestión de Materias
- Organización por plan de estudio y año
- Filtros avanzados
- Estadísticas en tiempo real

### ✅ Tablero Docente
- Vista matricial por día y turno
- Indicadores de carga docente
- Asignación de roles (Titular, Adjunto, Ayudante)
- Confirmación de asignaciones

### ✅ Sistema de Diseño
- Paleta institucional UNLa
- Componentes reutilizables
- Diseño responsive
- Feedback visual consistente

---

## 🛠️ Instalación y Ejecución

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend disponible en: `http://localhost:8080`

### Frontend

```bash
cd vite-frontend
npm install
npm run dev
```

Frontend disponible en: `http://localhost:5173`

---

## 📡 Endpoints API Principales

### Docentes
- `GET /api/docentes` - Listar docentes
- `POST /api/docentes` - Crear docente
- `PUT /api/docentes/{id}` - Actualizar
- `DELETE /api/docentes/{id}` - Eliminar

### Materias
- `GET /api/materias` - Listar materias
- `POST /api/materias` - Crear materia
- `PUT /api/materias/{id}` - Actualizar
- `DELETE /api/materias/{id}` - Eliminar

### Asignaciones
- `GET /api/asignaciones` - Listar asignaciones
- `POST /api/asignaciones` - Crear asignación
- Endpoints completos de CRUD

---

## 🎯 Características UX/UI

### Diseño Profesional
- Paleta institucional rojo UNLa
- Tipografía clara (Inter)
- Espaciado consistente
- Sombras y bordes sutiles

### Componentes
- Botones (primary, secondary, outline, danger)
- Cards con animaciones
- Tablas con hover effects
- Modales con transiciones
- Formularios validados
- Alerts contextuales

### Navegación
- Navbar sticky institucional
- Indicador de página activa
- Hub de gestión centralizado
- Accesos directos

---

## 📊 Validaciones

### Backend
- DNI único por docente
- Campos obligatorios
- Integridad referencial

### Frontend
- Formularios en tiempo real
- Confirmación de eliminaciones
- Estados de carga

---

## 👥 Autor

**Trabajo Final Integrador**  
Licenciatura en Sistemas  
Universidad Nacional de Lanús  
2026

---

## 📄 Documentación

- [Sistema de Diseño](./DESIGN_SYSTEM.md)
- Swagger API: `http://localhost:8080/swagger-ui.html`

---

**Universidad Nacional de Lanús**  
*Excelencia Académica desde 1995*
