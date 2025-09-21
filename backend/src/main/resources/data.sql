-- Script de datos iniciales para el sistema de gestión de docentes
-- Se ejecuta automáticamente al iniciar la aplicación

-- 1. Insertar Plan de estudios
INSERT INTO plan (id, nombre, descripcion) VALUES (1, 'Plan 2024', 'Plan de estudios actualizado 2024') ON CONFLICT (id) DO NOTHING;

-- 2. Insertar Materia
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (1, 'Matemáticas I', 1, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (2, 'Programación I', 1, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (3, 'Sistemas Operativos', 1, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (4, 'Gestión Universitaria', 1, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (5, 'Base de Datos I', 1, 2) ON CONFLICT (id) DO NOTHING;


-- 3. Insertar Cuatrimestre
INSERT INTO cuatrimestre (id, numero_cuatri) VALUES (1, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO cuatrimestre (id, numero_cuatri) VALUES (2, 2) ON CONFLICT (id) DO NOTHING;

-- 4. Asignaciones (años 2024 y 2025, cuatrimestres 1 y 2, días y turnos variados)
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (1, 1, 1, 'Mañana', 2025, 'Lunes') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (2, 2, 1, 'Tarde', 2025, 'Martes') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (3, 3, 1, 'Noche', 2025, 'Miercoles') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (4, 4, 1, 'Mañana', 2025, 'Jueves') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (5, 5, 1, 'Tarde', 2025, 'Viernes') ON CONFLICT (id) DO NOTHING;

INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (6, 1, 1, 'Noche', 2025, 'Lunes') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (7, 2, 1, 'Mañana', 2025, 'Martes') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (8, 3, 1, 'Tarde', 2025, 'Miercoles') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (9, 4, 1, 'Noche', 2025, 'Jueves') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (10, 5, 1, 'Mañana', 2025, 'Viernes') ON CONFLICT (id) DO NOTHING;

-- Año 2024 - Cuatrimestre 1
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (11, 1, 1, 'Tarde', 2024, 'Lunes') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (12, 2, 1, 'Noche', 2024, 'Martes') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (13, 3, 1, 'Mañana', 2024, 'Miercoles') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (14, 4, 1, 'Tarde', 2024, 'Jueves') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (15, 5, 1, 'Noche', 2024, 'Viernes') ON CONFLICT (id) DO NOTHING;

-- Año 2025 - Cuatrimestre 2
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (16, 1, 2, 'Mañana', 2025, 'Lunes') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (17, 2, 2, 'Tarde', 2025, 'Martes') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (18, 3, 2, 'Noche', 2025, 'Miercoles') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (19, 4, 2, 'Mañana', 2025, 'Jueves') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (20, 5, 2, 'Tarde', 2025, 'Viernes') ON CONFLICT (id) DO NOTHING;

-- Año 2024 - Cuatrimestre 2
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (21, 1, 2, 'Tarde', 2024, 'Lunes') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (22, 2, 2, 'Noche', 2024, 'Martes') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (23, 3, 2, 'Mañana', 2024, 'Miercoles') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (24, 4, 2, 'Tarde', 2024, 'Jueves') ON CONFLICT (id) DO NOTHING;
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (25, 5, 2, 'Noche', 2024, 'Viernes') ON CONFLICT (id) DO NOTHING;


-- 5. Insertar Rol
INSERT INTO rol (id, nombre) VALUES (1, 'Titular') ON CONFLICT (id) DO NOTHING;

-- 6. Insertar Categoría
INSERT INTO categoria (id, nombre, max_materias) VALUES (1, 'Titular', 4) ON CONFLICT (id) DO NOTHING;

-- 7. Insertar Docente de ejemplo
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (1, 'Dr. Juan Pérez', '12345678', 1) ON CONFLICT (id) DO NOTHING;

-- 8. Insertar Asignación Docente
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (1, 1, 1, 1, 10, true) ON CONFLICT (id) DO NOTHING; 



-- Después de insertar asignaciones manuales
SELECT setval('asignacion_seq', (SELECT MAX(id) FROM asignacion));

-- Después de insertar materias
SELECT setval('materia_seq', (SELECT MAX(id) FROM materia));

-- Después de insertar docentes
SELECT setval('docente_seq', (SELECT MAX(id) FROM docente));


-- Después de insertar asignaciones-docentes
SELECT setval('asignacion_docente_seq', (SELECT MAX(id) FROM asignacion_docente));
