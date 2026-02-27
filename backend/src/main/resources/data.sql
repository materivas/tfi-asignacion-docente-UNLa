-- Script de datos iniciales para el sistema de gestión de docentes
-- Se ejecuta automáticamente al iniciar la aplicación
-- Limpia datos existentes en orden de dependencia inversa para evitar conflictos
DELETE FROM asignacion_docente;
DELETE FROM asignacion;
DELETE FROM docente;
DELETE FROM materia;
DELETE FROM cuatrimestre;
DELETE FROM rol;
DELETE FROM categoria;
DELETE FROM plan;

-- 1. Insertar Plan de estudios
INSERT INTO plan (id, nombre, descripcion) VALUES (1, 'Plan 2024', 'Plan de estudios actualizado 2024');

-- 2. Insertar Materias (1° a 5° año, variadas)
-- 1° Año
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (1, 'Matemáticas I', 1, 1);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (2, 'Programación I', 1, 1);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (6, 'Álgebra', 1, 1);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (7, 'Introducción a la Informática', 1, 1);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (8, 'Inglés I', 1, 1);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (9, 'Lógica y Estructura de Datos', 1, 1);
-- 2° Año
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (3, 'Sistemas Operativos', 1, 2);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (5, 'Base de Datos I', 1, 2);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (10, 'Matemáticas II', 1, 2);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (11, 'Programación II', 1, 2);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (12, 'Arquitectura de Computadoras', 1, 2);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (13, 'Inglés II', 1, 2);
-- 3° Año
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (4, 'Gestión Universitaria', 1, 3);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (14, 'Ingeniería de Software I', 1, 3);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (15, 'Redes de Computadoras', 1, 3);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (16, 'Base de Datos II', 1, 3);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (17, 'Estadística', 1, 3);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (18, 'Programación III', 1, 3);
-- 4° Año
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (19, 'Ingeniería de Software II', 1, 4);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (20, 'Seguridad Informática', 1, 4);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (21, 'Inteligencia Artificial', 1, 4);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (22, 'Gestión de Proyectos', 1, 4);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (23, 'Sistemas Distribuidos', 1, 4);
-- 5° Año
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (24, 'Trabajo Final Integrador', 1, 5);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (25, 'Ética Profesional', 1, 5);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (26, 'Auditoría de Sistemas', 1, 5);
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (27, 'Legislación Informática', 1, 5);

-- 3. Insertar Cuatrimestre
INSERT INTO cuatrimestre (id, numero_cuatri) VALUES (1, 1);
INSERT INTO cuatrimestre (id, numero_cuatri) VALUES (2, 2);

-- 4. Insertar Roles
INSERT INTO rol (id, nombre) VALUES (1, 'Titular');
INSERT INTO rol (id, nombre) VALUES (2, 'Adjunto');
INSERT INTO rol (id, nombre) VALUES (3, 'JTP');
INSERT INTO rol (id, nombre) VALUES (4, 'Ayudante');

-- 5. Insertar Categorías
INSERT INTO categoria (id, nombre, max_materias) VALUES (1, 'Titular', 4);
INSERT INTO categoria (id, nombre, max_materias) VALUES (2, 'Adjunto', 3);
INSERT INTO categoria (id, nombre, max_materias) VALUES (3, 'JTP', 5);
INSERT INTO categoria (id, nombre, max_materias) VALUES (4, 'Ayudante', 6);

-- 6. Insertar Docentes
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (1, 'Dr. Juan Pérez', '12345678', 1);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (2, 'Lic. María García', '23456789', 2);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (3, 'Ing. Carlos López', '34567890', 1);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (4, 'Dra. Ana Martínez', '45678901', 3);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (5, 'Prof. Roberto Sánchez', '56789012', 2);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (6, 'Mg. Laura Fernández', '67890123', 1);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (7, 'Ing. Pablo Gómez', '78901234', 3);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (8, 'Lic. Silvia Romero', '89012345', 4);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (9, 'Dr. Martín Díaz', '90123456', 1);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (10, 'Prof. Claudia Torres', '01234567', 2);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (11, 'Ing. Fernando Ruiz', '11223344', 3);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (12, 'Lic. Natalia Vega', '22334455', 4);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (13, 'Dr. Gustavo Herrera', '33445566', 1);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (14, 'Prof. Daniela Castro', '44556677', 2);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (15, 'Mg. Alejandro Méndez', '55667788', 3);

-- 7. Asignaciones - Año 2025, Cuatrimestre 1
-- 1° Año
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (1, 1, 1, 'Mañana', 2025, 'Lunes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (2, 2, 1, 'Tarde', 2025, 'Martes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (3, 6, 1, 'Mañana', 2025, 'Miercoles');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (4, 7, 1, 'Tarde', 2025, 'Jueves');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (5, 8, 1, 'Noche', 2025, 'Viernes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (6, 9, 1, 'Mañana', 2025, 'Lunes');
-- 2° Año
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (7, 3, 1, 'Noche', 2025, 'Miercoles');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (8, 5, 1, 'Tarde', 2025, 'Viernes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (9, 10, 1, 'Mañana', 2025, 'Martes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (10, 11, 1, 'Tarde', 2025, 'Jueves');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (11, 12, 1, 'Noche', 2025, 'Lunes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (12, 13, 1, 'Mañana', 2025, 'Viernes');
-- 3° Año
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (13, 4, 1, 'Mañana', 2025, 'Jueves');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (14, 14, 1, 'Tarde', 2025, 'Lunes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (15, 15, 1, 'Noche', 2025, 'Martes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (16, 16, 1, 'Mañana', 2025, 'Miercoles');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (17, 17, 1, 'Tarde', 2025, 'Jueves');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (18, 18, 1, 'Noche', 2025, 'Viernes');
-- 4° Año
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (19, 19, 1, 'Mañana', 2025, 'Lunes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (20, 20, 1, 'Tarde', 2025, 'Martes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (21, 21, 1, 'Noche', 2025, 'Miercoles');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (22, 22, 1, 'Mañana', 2025, 'Jueves');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (23, 23, 1, 'Tarde', 2025, 'Viernes');
-- 5° Año
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (24, 24, 1, 'Mañana', 2025, 'Lunes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (25, 25, 1, 'Tarde', 2025, 'Martes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (26, 26, 1, 'Noche', 2025, 'Miercoles');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (27, 27, 1, 'Mañana', 2025, 'Jueves');

-- Asignaciones - Año 2025, Cuatrimestre 2
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (28, 1, 2, 'Tarde', 2025, 'Lunes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (29, 2, 2, 'Noche', 2025, 'Martes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (30, 6, 2, 'Mañana', 2025, 'Miercoles');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (31, 10, 2, 'Tarde', 2025, 'Jueves');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (32, 14, 2, 'Mañana', 2025, 'Viernes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (33, 19, 2, 'Noche', 2025, 'Lunes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (34, 24, 2, 'Tarde', 2025, 'Martes');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (35, 20, 2, 'Mañana', 2025, 'Miercoles');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia) VALUES (36, 15, 2, 'Noche', 2025, 'Jueves');

-- 8. Insertar Asignaciones Docentes (docentes asignados a materias)
-- 1° Año - Cuatrimestre 1
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (1, 1, 1, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (2, 1, 8, 4, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (3, 2, 3, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (4, 2, 7, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (5, 3, 1, 1, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (6, 3, 12, 4, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (7, 4, 6, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (8, 5, 10, 2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (9, 6, 3, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (10, 6, 11, 3, 4, true);
-- 2° Año - Cuatrimestre 1
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (11, 7, 9, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (12, 7, 4, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (13, 8, 13, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (14, 8, 15, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (15, 9, 2, 2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (16, 10, 7, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (17, 10, 12, 4, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (18, 11, 6, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (19, 12, 10, 2, 6, true);
-- 3° Año - Cuatrimestre 1
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (20, 13, 5, 2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (21, 14, 9, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (22, 14, 4, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (23, 15, 13, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (24, 15, 11, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (25, 16, 13, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (26, 16, 8, 4, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (27, 17, 2, 2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (28, 18, 3, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (29, 18, 15, 3, 4, true);
-- 4° Año - Cuatrimestre 1
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (30, 19, 9, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (31, 19, 7, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (32, 20, 6, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (33, 20, 14, 2, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (34, 21, 1, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (35, 21, 4, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (36, 22, 5, 2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (37, 23, 13, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (38, 23, 11, 3, 4, true);
-- 5° Año - Cuatrimestre 1
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (39, 24, 9, 1, 10, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (40, 24, 6, 2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (41, 25, 5, 2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (42, 26, 6, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (43, 26, 15, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (44, 27, 14, 2, 6, true);
-- Cuatrimestre 2
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (45, 28, 1, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (46, 28, 12, 4, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (47, 29, 3, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (48, 30, 2, 2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (49, 31, 2, 2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (50, 32, 9, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (51, 32, 4, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (52, 33, 9, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (53, 34, 5, 2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (54, 35, 6, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (55, 35, 14, 2, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (56, 36, 13, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (57, 36, 11, 3, 4, true);

-- Resetear secuencias
SELECT setval('asignacion_seq', (SELECT COALESCE(MAX(id), 1) FROM asignacion));
SELECT setval('materia_seq', (SELECT COALESCE(MAX(id), 1) FROM materia));
SELECT setval('docente_seq', (SELECT COALESCE(MAX(id), 1) FROM docente));
SELECT setval('asignacion_docente_seq', (SELECT COALESCE(MAX(id), 1) FROM asignacion_docente));
SELECT setval('plan_seq', (SELECT COALESCE(MAX(id), 1) FROM plan));
SELECT setval('categoria_seq', (SELECT COALESCE(MAX(id), 1) FROM categoria));
SELECT setval('rol_seq', (SELECT COALESCE(MAX(id), 1) FROM rol));
SELECT setval('cuatrimestre_seq', (SELECT COALESCE(MAX(id), 1) FROM cuatrimestre));
