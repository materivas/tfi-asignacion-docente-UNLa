-- Script de datos iniciales para el sistema de gestión de docentes
-- Se ejecuta automáticamente al iniciar la aplicación
-- NOTA: El usuario admin se crea automáticamente mediante DataInitializer.java
-- Comisión: {codigo_materia}-1 {TM|TT|TN}  (Maniana=TM, Tarde=TT, Noche=TN)

-- =====================================
-- LIMPIEZA
-- =====================================
DELETE FROM asignacion_docente;
DELETE FROM asignacion;
DELETE FROM docente;
DELETE FROM materia;
DELETE FROM cuatrimestre;
DELETE FROM rol;
DELETE FROM categoria;
DELETE FROM plan;

-- =====================================
-- 1. PLAN DE ESTUDIOS
-- =====================================
INSERT INTO plan (id, nombre, descripcion) VALUES (1, 'Plan 2024', 'Plan de estudios actualizado 2024');

-- =====================================
-- 2. MATERIAS con código por año
-- Códigos: 1xx = 1°año, 2xx = 2°año, 3xx = 3°año, 4xx = 4°año, 5xx = 5°año
-- =====================================
-- 1° Año
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (1,  'Matemáticas I',                 1, 1, 101);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (2,  'Programación I',                1, 1, 102);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (3,  'Álgebra',                       1, 1, 103);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (4,  'Introducción a la Informática', 1, 1, 104);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (5,  'Inglés I',                      1, 1, 105);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (6,  'Lógica y Estructura de Datos',  1, 1, 106);
-- 2° Año
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (7,  'Sistemas Operativos',           1, 2, 201);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (8,  'Base de Datos I',               1, 2, 202);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (9,  'Matemáticas II',                1, 2, 203);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (10, 'Programación II',               1, 2, 204);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (11, 'Arquitectura de Computadoras',  1, 2, 205);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (12, 'Inglés II',                     1, 2, 206);
-- 3° Año
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (13, 'Gestión Universitaria',         1, 3, 301);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (14, 'Ingeniería de Software I',      1, 3, 302);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (15, 'Redes de Computadoras',         1, 3, 303);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (16, 'Base de Datos II',              1, 3, 304);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (17, 'Estadística',                   1, 3, 305);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (18, 'Programación III',              1, 3, 306);
-- 4° Año
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (19, 'Ingeniería de Software II',     1, 4, 401);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (20, 'Seguridad Informática',         1, 4, 402);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (21, 'Inteligencia Artificial',       1, 4, 403);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (22, 'Gestión de Proyectos',          1, 4, 404);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (23, 'Sistemas Distribuidos',         1, 4, 405);
-- 5° Año
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (24, 'Trabajo Final Integrador',      1, 5, 501);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (25, 'Ética Profesional',             1, 5, 502);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (26, 'Auditoría de Sistemas',         1, 5, 503);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (27, 'Legislación Informática',       1, 5, 504);

-- =====================================
-- 3. CUATRIMESTRES
-- =====================================
INSERT INTO cuatrimestre (id, numero_cuatri) VALUES (1, 1);
INSERT INTO cuatrimestre (id, numero_cuatri) VALUES (2, 2);

-- =====================================
-- 4. ROLES
-- =====================================
INSERT INTO rol (id, nombre) VALUES (1, 'Titular');
INSERT INTO rol (id, nombre) VALUES (2, 'Adjunto');
INSERT INTO rol (id, nombre) VALUES (3, 'JTP');
INSERT INTO rol (id, nombre) VALUES (4, 'Ayudante');

-- =====================================
-- 5. CATEGORÍAS
-- =====================================
INSERT INTO categoria (id, nombre, max_materias) VALUES (1, 'Titular', 4);
INSERT INTO categoria (id, nombre, max_materias) VALUES (2, 'Adjunto', 3);
INSERT INTO categoria (id, nombre, max_materias) VALUES (3, 'JTP',     5);
INSERT INTO categoria (id, nombre, max_materias) VALUES (4, 'Ayudante', 6);

-- =====================================
-- 6. DOCENTES
-- =====================================
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (1,  'Dr. Juan Pérez',         '12345678', 1);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (2,  'Lic. María García',      '23456789', 2);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (3,  'Ing. Carlos López',      '34567890', 1);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (4,  'Dra. Ana Martínez',      '45678901', 3);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (5,  'Prof. Roberto Sánchez',  '56789012', 2);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (6,  'Mg. Laura Fernández',    '67890123', 1);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (7,  'Ing. Pablo Gómez',       '78901234', 3);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (8,  'Lic. Silvia Romero',     '89012345', 4);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (9,  'Dr. Martín Díaz',        '90123456', 1);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (10, 'Prof. Claudia Torres',   '01234567', 2);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (11, 'Ing. Fernando Ruiz',     '11223344', 3);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (12, 'Lic. Natalia Vega',      '22334455', 4);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (13, 'Dr. Gustavo Herrera',    '33445566', 1);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (14, 'Prof. Daniela Castro',   '44556677', 2);
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (15, 'Mg. Alejandro Méndez',   '55667788', 3);

-- =====================================
-- 7. ASIGNACIONES (turno: Maniana | Tarde | Noche)
-- comision = {codigo_materia}-1 TM|TT|TN
-- =====================================

-- Cuatrimestre 1 — 2025  (1° Año)
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (1,  1,  1, 'Maniana', 2025, 'Lunes',     '101-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (2,  2,  1, 'Tarde',   2025, 'Martes',    '102-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (3,  3,  1, 'Maniana', 2025, 'Miercoles', '103-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (4,  4,  1, 'Tarde',   2025, 'Jueves',    '104-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (5,  5,  1, 'Noche',   2025, 'Viernes',   '105-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (6,  6,  1, 'Maniana', 2025, 'Sabado',    '106-1 TM');

-- Cuatrimestre 1 — 2025  (2° Año)
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (7,  7,  1, 'Noche',   2025, 'Lunes',     '201-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (8,  8,  1, 'Tarde',   2025, 'Martes',    '202-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (9,  9,  1, 'Maniana', 2025, 'Miercoles', '203-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (10, 10, 1, 'Tarde',   2025, 'Jueves',    '204-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (11, 11, 1, 'Noche',   2025, 'Viernes',   '205-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (12, 12, 1, 'Maniana', 2025, 'Sabado',    '206-1 TM');

-- Cuatrimestre 1 — 2025  (3° Año)
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (13, 13, 1, 'Maniana', 2025, 'Lunes',     '301-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (14, 14, 1, 'Tarde',   2025, 'Martes',    '302-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (15, 15, 1, 'Noche',   2025, 'Miercoles', '303-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (16, 16, 1, 'Maniana', 2025, 'Jueves',    '304-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (17, 17, 1, 'Tarde',   2025, 'Viernes',   '305-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (18, 18, 1, 'Noche',   2025, 'Sabado',    '306-1 TN');

-- Cuatrimestre 1 — 2025  (4° Año)
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (19, 19, 1, 'Maniana', 2025, 'Lunes',     '401-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (20, 20, 1, 'Tarde',   2025, 'Martes',    '402-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (21, 21, 1, 'Noche',   2025, 'Miercoles', '403-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (22, 22, 1, 'Maniana', 2025, 'Jueves',    '404-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (23, 23, 1, 'Tarde',   2025, 'Viernes',   '405-1 TT');

-- Cuatrimestre 1 — 2025  (5° Año)
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (24, 24, 1, 'Maniana', 2025, 'Lunes',     '501-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (25, 25, 1, 'Tarde',   2025, 'Martes',    '502-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (26, 26, 1, 'Noche',   2025, 'Miercoles', '503-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (27, 27, 1, 'Maniana', 2025, 'Jueves',    '504-1 TM');

-- Cuatrimestre 2 — 2025
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (28, 1,  2, 'Tarde',   2025, 'Lunes',     '101-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (29, 2,  2, 'Noche',   2025, 'Martes',    '102-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (30, 3,  2, 'Maniana', 2025, 'Miercoles', '103-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (31, 9,  2, 'Tarde',   2025, 'Jueves',    '203-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (32, 14, 2, 'Maniana', 2025, 'Viernes',   '302-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (33, 19, 2, 'Noche',   2025, 'Lunes',     '401-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (34, 24, 2, 'Tarde',   2025, 'Martes',    '501-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (35, 20, 2, 'Maniana', 2025, 'Miercoles', '402-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (36, 15, 2, 'Noche',   2025, 'Jueves',    '303-1 TN');

-- =====================================
-- 8. ASIGNACIONES DOCENTES
-- =====================================

-- Cuatrimestre 1 — 1° Año
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (1,  1,  1,  1, 8, true);   -- Juan Pérez titular Matemáticas I
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (2,  1,  8,  4, 4, true);   -- Silvia Romero ayudante Matemáticas I
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (3,  2,  3,  1, 8, true);   -- Carlos López titular Programación I
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (4,  2,  7,  3, 4, true);   -- Pablo Gómez JTP Programación I
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (5,  3,  1,  1, 6, true);   -- Juan Pérez titular Álgebra
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (6,  3,  12, 4, 4, true);   -- Natalia Vega ayudante Álgebra
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (7,  4,  6,  1, 8, true);   -- Laura Fernández titular Intro Informática
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (8,  5,  10, 2, 6, true);   -- Claudia Torres adjunto Inglés I
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (9,  6,  3,  1, 8, true);   -- Carlos López titular Lógica
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (10, 6,  11, 3, 4, true);   -- Fernando Ruiz JTP Lógica

-- Cuatrimestre 1 — 2° Año
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (11, 7,  9,  1, 8, true);   -- Martín Díaz titular Sist. Operativos
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (12, 7,  4,  3, 4, true);   -- Ana Martínez JTP Sist. Operativos
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (13, 8,  13, 1, 8, true);   -- Gustavo Herrera titular BD I
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (14, 8,  15, 3, 4, true);   -- Alejandro Méndez JTP BD I
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (15, 9,  2,  2, 6, true);   -- María García adjunto Matemáticas II
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (16, 10, 7,  1, 8, true);   -- Pablo Gómez titular Programación II
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (17, 10, 12, 4, 4, true);   -- Natalia Vega ayudante Programación II
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (18, 11, 6,  1, 8, true);   -- Laura Fernández titular Arq. Computadoras
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (19, 12, 10, 2, 6, true);   -- Claudia Torres adjunto Inglés II

-- Cuatrimestre 1 — 3° Año
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (20, 13, 5,  2, 6, true);   -- Roberto Sánchez adjunto Gestión Univ.
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (21, 14, 9,  1, 8, true);   -- Martín Díaz titular Ing. Software I
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (22, 14, 4,  3, 4, true);   -- Ana Martínez JTP Ing. Software I
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (23, 15, 13, 1, 8, true);   -- Gustavo Herrera titular Redes
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (24, 15, 11, 3, 4, true);   -- Fernando Ruiz JTP Redes
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (25, 16, 13, 1, 8, true);   -- Gustavo Herrera titular BD II
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (26, 16, 8,  4, 4, true);   -- Silvia Romero ayudante BD II
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (27, 17, 2,  2, 6, true);   -- María García adjunto Estadística
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (28, 18, 3,  1, 8, true);   -- Carlos López titular Programación III
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (29, 18, 15, 3, 4, true);   -- Alejandro Méndez JTP Programación III

-- Cuatrimestre 1 — 4° Año
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (30, 19, 9,  1, 8, true);   -- Martín Díaz titular Ing. Software II
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (31, 19, 7,  3, 4, true);   -- Pablo Gómez JTP Ing. Software II
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (32, 20, 6,  1, 8, true);   -- Laura Fernández titular Seguridad
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (33, 20, 14, 2, 4, true);   -- Daniela Castro adjunto Seguridad
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (34, 21, 1,  1, 8, true);   -- Juan Pérez titular IA
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (35, 21, 4,  3, 4, true);   -- Ana Martínez JTP IA
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (36, 22, 5,  2, 6, true);   -- Roberto Sánchez adjunto Gestión Proyectos
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (37, 23, 13, 1, 8, true);   -- Gustavo Herrera titular Sist. Distribuidos
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (38, 23, 11, 3, 4, true);   -- Fernando Ruiz JTP Sist. Distribuidos

-- Cuatrimestre 1 — 5° Año
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (39, 24, 9,  1, 10, true);  -- Martín Díaz titular TFI
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (40, 24, 6,  2, 6,  true);  -- Laura Fernández adjunto TFI
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (41, 25, 5,  2, 6,  true);  -- Roberto Sánchez adjunto Ética
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (42, 26, 6,  1, 8,  true);  -- Laura Fernández titular Auditoría
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (43, 26, 15, 3, 4,  true);  -- Alejandro Méndez JTP Auditoría
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (44, 27, 14, 2, 6,  true);  -- Daniela Castro adjunto Legislación

-- Cuatrimestre 2
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (45, 28, 1,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (46, 28, 12, 4, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (47, 29, 3,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (48, 30, 2,  2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (49, 31, 2,  2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (50, 32, 9,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (51, 32, 4,  3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (52, 33, 9,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (53, 34, 5,  2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (54, 35, 6,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (55, 35, 14, 2, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (56, 36, 13, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (57, 36, 11, 3, 4, true);

-- =====================================
-- 9. RESETEAR SECUENCIAS
-- =====================================
SELECT setval('asignacion_seq',         (SELECT COALESCE(MAX(id), 1) FROM asignacion));
SELECT setval('asignacion_docente_seq', (SELECT COALESCE(MAX(id), 1) FROM asignacion_docente));
SELECT setval('materia_seq',            (SELECT COALESCE(MAX(id), 1) FROM materia));
SELECT setval('docente_seq',            (SELECT COALESCE(MAX(id), 1) FROM docente));
SELECT setval('plan_seq',               (SELECT COALESCE(MAX(id), 1) FROM plan));
SELECT setval('categoria_seq',          (SELECT COALESCE(MAX(id), 1) FROM categoria));
SELECT setval('docente_seq', (SELECT COALESCE(MAX(id), 1) FROM docente));
SELECT setval('asignacion_docente_seq', (SELECT COALESCE(MAX(id), 1) FROM asignacion_docente));
SELECT setval('plan_seq', (SELECT COALESCE(MAX(id), 1) FROM plan));
SELECT setval('categoria_seq', (SELECT COALESCE(MAX(id), 1) FROM categoria));
SELECT setval('rol_seq', (SELECT COALESCE(MAX(id), 1) FROM rol));
SELECT setval('cuatrimestre_seq', (SELECT COALESCE(MAX(id), 1) FROM cuatrimestre));
