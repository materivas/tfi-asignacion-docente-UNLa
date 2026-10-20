-- Script de datos iniciales para el sistema de gestion de docentes
-- Seed manual/optativo; SPRING_SQL_INIT_MODE=always lo ejecuta al iniciar.
-- NOTA: El usuario admin se crea automaticamente mediante DataInitializer.java
-- Comision: {codigo_materia}-1 {TM|TT|TN} (Maniana=TM, Tarde=TT, Noche=TN)

ALTER TABLE asignacion ADD COLUMN IF NOT EXISTS created_by varchar(100) DEFAULT 'system';
ALTER TABLE asignacion ADD COLUMN IF NOT EXISTS updated_by varchar(100) DEFAULT 'system';
ALTER TABLE asignacion ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE asignacion ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE docente ADD COLUMN IF NOT EXISTS created_by varchar(100) DEFAULT 'system';
ALTER TABLE docente ADD COLUMN IF NOT EXISTS updated_by varchar(100) DEFAULT 'system';
ALTER TABLE docente ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE docente ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE materia ADD COLUMN IF NOT EXISTS created_by varchar(100) DEFAULT 'system';
ALTER TABLE materia ADD COLUMN IF NOT EXISTS updated_by varchar(100) DEFAULT 'system';
ALTER TABLE materia ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE materia ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE asignacion_docente ADD COLUMN IF NOT EXISTS created_by varchar(100) DEFAULT 'system';
ALTER TABLE asignacion_docente ADD COLUMN IF NOT EXISTS updated_by varchar(100) DEFAULT 'system';
ALTER TABLE asignacion_docente ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE asignacion_docente ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE asignacion ALTER COLUMN created_by SET DEFAULT 'system';
ALTER TABLE asignacion ALTER COLUMN updated_by SET DEFAULT 'system';
ALTER TABLE asignacion ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE asignacion ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE docente ALTER COLUMN created_by SET DEFAULT 'system';
ALTER TABLE docente ALTER COLUMN updated_by SET DEFAULT 'system';
ALTER TABLE docente ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE docente ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE materia ALTER COLUMN created_by SET DEFAULT 'system';
ALTER TABLE materia ALTER COLUMN updated_by SET DEFAULT 'system';
ALTER TABLE materia ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE materia ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE asignacion_docente ALTER COLUMN created_by SET DEFAULT 'system';
ALTER TABLE asignacion_docente ALTER COLUMN updated_by SET DEFAULT 'system';
ALTER TABLE asignacion_docente ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE asignacion_docente ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

UPDATE asignacion SET created_by = COALESCE(created_by, 'system'), updated_by = COALESCE(updated_by, 'system'), created_at = COALESCE(created_at, CURRENT_TIMESTAMP), updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);
UPDATE docente SET created_by = COALESCE(created_by, 'system'), updated_by = COALESCE(updated_by, 'system'), created_at = COALESCE(created_at, CURRENT_TIMESTAMP), updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);
UPDATE materia SET created_by = COALESCE(created_by, 'system'), updated_by = COALESCE(updated_by, 'system'), created_at = COALESCE(created_at, CURRENT_TIMESTAMP), updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);
UPDATE asignacion_docente SET created_by = COALESCE(created_by, 'system'), updated_by = COALESCE(updated_by, 'system'), created_at = COALESCE(created_at, CURRENT_TIMESTAMP), updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP);

ALTER TABLE asignacion ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE asignacion ALTER COLUMN updated_by SET NOT NULL;
ALTER TABLE asignacion ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE asignacion ALTER COLUMN updated_at SET NOT NULL;
ALTER TABLE docente ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE docente ALTER COLUMN updated_by SET NOT NULL;
ALTER TABLE docente ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE docente ALTER COLUMN updated_at SET NOT NULL;
ALTER TABLE materia ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE materia ALTER COLUMN updated_by SET NOT NULL;
ALTER TABLE materia ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE materia ALTER COLUMN updated_at SET NOT NULL;
ALTER TABLE asignacion_docente ALTER COLUMN created_by SET NOT NULL;
ALTER TABLE asignacion_docente ALTER COLUMN updated_by SET NOT NULL;
ALTER TABLE asignacion_docente ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE asignacion_docente ALTER COLUMN updated_at SET NOT NULL;

-- =====================================
-- LIMPIEZA
-- =====================================
-- Este bloque elimina todos los datos del dominio. Ejecutarlo solo para un
-- bootstrap/reset manual, nunca en cada reinicio de una base con auditoria.
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
-- 2. MATERIAS
-- =====================================
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (1,  'Matemáticas I',                 1, 1, 101);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (2,  'Programación I',                1, 1, 102);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (3,  'Álgebra',                       1, 1, 103);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (4,  'Introducción a la Informática', 1, 1, 104);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (5,  'Inglés I',                      1, 1, 105);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (6,  'Lógica y Estructura de Datos',  1, 1, 106);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (7,  'Sistemas Operativos',           1, 2, 201);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (8,  'Base de Datos I',               1, 2, 202);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (9,  'Matemáticas II',                1, 2, 203);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (10, 'Programación II',               1, 2, 204);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (11, 'Arquitectura de Computadoras',  1, 2, 205);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (12, 'Inglés II',                     1, 2, 206);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (13, 'Gestión Universitaria',         1, 3, 301);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (14, 'Ingeniería de Software I',      1, 3, 302);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (15, 'Redes de Computadoras',         1, 3, 303);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (16, 'Base de Datos II',              1, 3, 304);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (17, 'Estadística',                   1, 3, 305);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (18, 'Programación III',              1, 3, 306);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (19, 'Ingeniería de Software II',     1, 4, 401);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (20, 'Seguridad Informática',         1, 4, 402);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (21, 'Inteligencia Artificial',       1, 4, 403);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (22, 'Gestión de Proyectos',          1, 4, 404);
INSERT INTO materia (id, nombre, plan_id, anio, codigo) VALUES (23, 'Sistemas Distribuidos',         1, 4, 405);
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
-- 5. CATEGORIAS
-- =====================================
INSERT INTO categoria (id, nombre, max_materias) VALUES (1, 'Instructor/a Ayudante', 6);
INSERT INTO categoria (id, nombre, max_materias) VALUES (2, 'JTP', 5);
INSERT INTO categoria (id, nombre, max_materias) VALUES (3, 'Adjunta/o', 4);
INSERT INTO categoria (id, nombre, max_materias) VALUES (4, 'Asociada/o', 3);
INSERT INTO categoria (id, nombre, max_materias) VALUES (5, 'Titular', 4);

-- =====================================
-- 6. DOCENTES
-- =====================================
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (1,  'Dr. Juan Perez',         '12345678', 5, 'EXCLUSIVA', true);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (2,  'Lic. Maria Garcia',      '23456789', 3, 'SEMI_EXCLUSIVA', true);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (3,  'Ing. Carlos Lopez',      '34567890', 5, 'EXCLUSIVA', true);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (4,  'Dra. Ana Martinez',      '45678901', 2, 'SIMPLE', false);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (5,  'Prof. Roberto Sanchez',  '56789012', 4, 'SEMI_EXCLUSIVA', true);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (6,  'Mg. Laura Fernandez',    '67890123', 5, 'EXCLUSIVA', true);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (7,  'Ing. Pablo Gomez',       '78901234', 2, 'SIMPLE', false);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (8,  'Lic. Silvia Romero',     '89012345', 1, 'SIMPLE', false);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (9,  'Dr. Martin Diaz',        '90123456', 5, 'EXCLUSIVA', true);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (10, 'Prof. Claudia Torres',   '01234567', 3, 'SEMI_EXCLUSIVA', true);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (11, 'Ing. Fernando Ruiz',     '11223344', 2, 'SIMPLE', false);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (12, 'Lic. Natalia Vega',      '22334455', 1, 'SIMPLE', false);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (13, 'Dr. Gustavo Herrera',    '33445566', 5, 'EXCLUSIVA', true);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (14, 'Prof. Daniela Castro',   '44556677', 3, 'SEMI_EXCLUSIVA', true);
INSERT INTO docente (id, nombre, dni, categoria_id, dedicacion, concursado) VALUES (15, 'Mg. Alejandro Mendez',   '55667788', 2, 'SIMPLE', false);

-- =====================================
-- 7. ASIGNACIONES
-- =====================================
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (1,  1,  1, 'Maniana', 2025, 'Lunes',     '101-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (2,  2,  1, 'Tarde',   2025, 'Martes',    '102-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (3,  3,  1, 'Maniana', 2025, 'Miercoles', '103-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (4,  4,  1, 'Tarde',   2025, 'Jueves',    '104-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (5,  5,  1, 'Noche',   2025, 'Viernes',   '105-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (6,  6,  1, 'Maniana', 2025, 'Sabado',    '106-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (7,  7,  1, 'Noche',   2025, 'Lunes',     '201-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (8,  8,  1, 'Tarde',   2025, 'Martes',    '202-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (9,  9,  1, 'Maniana', 2025, 'Miercoles', '203-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (10, 10, 1, 'Tarde',   2025, 'Jueves',    '204-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (11, 11, 1, 'Noche',   2025, 'Viernes',   '205-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (12, 12, 1, 'Maniana', 2025, 'Sabado',    '206-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (13, 13, 1, 'Maniana', 2025, 'Lunes',     '301-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (14, 14, 1, 'Tarde',   2025, 'Martes',    '302-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (15, 15, 1, 'Noche',   2025, 'Miercoles', '303-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (16, 16, 1, 'Maniana', 2025, 'Jueves',    '304-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (17, 17, 1, 'Tarde',   2025, 'Viernes',   '305-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (18, 18, 1, 'Noche',   2025, 'Sabado',    '306-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (19, 19, 1, 'Maniana', 2025, 'Lunes',     '401-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (20, 20, 1, 'Tarde',   2025, 'Martes',    '402-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (21, 21, 1, 'Noche',   2025, 'Miercoles', '403-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (22, 22, 1, 'Maniana', 2025, 'Jueves',    '404-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (23, 23, 1, 'Tarde',   2025, 'Viernes',   '405-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (24, 24, 1, 'Maniana', 2025, 'Lunes',     '501-1 TM');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (25, 25, 1, 'Tarde',   2025, 'Martes',    '502-1 TT');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (26, 26, 1, 'Noche',   2025, 'Miercoles', '503-1 TN');
INSERT INTO asignacion (id, materia_id, cuatrimestre_id, turno, anio, dia, comision) VALUES (27, 27, 1, 'Maniana', 2025, 'Jueves',    '504-1 TM');
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
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (1,  1,  1,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (2,  1,  8,  4, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (3,  2,  3,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (4,  2,  7,  3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (5,  3,  1,  1, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (6,  3,  12, 4, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (7,  4,  6,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (8,  5,  10, 2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (9,  6,  3,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (10, 6,  11, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (11, 7,  9,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (12, 7,  4,  3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (13, 8,  13, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (14, 8,  15, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (15, 9,  2,  2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (16, 10, 7,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (17, 10, 12, 4, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (18, 11, 6,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (19, 12, 10, 2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (20, 13, 5,  2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (21, 14, 9,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (22, 14, 4,  3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (23, 15, 13, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (24, 15, 11, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (25, 16, 13, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (26, 16, 8,  4, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (27, 17, 2,  2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (28, 18, 3,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (29, 18, 15, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (30, 19, 9,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (31, 19, 7,  3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (32, 20, 6,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (33, 20, 14, 2, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (34, 21, 1,  1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (35, 21, 4,  3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (36, 22, 5,  2, 6, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (37, 23, 13, 1, 8, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (38, 23, 11, 3, 4, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (39, 24, 9,  1, 10, true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (40, 24, 6,  2, 6,  true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (41, 25, 5,  2, 6,  true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (42, 26, 6,  1, 8,  true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (43, 26, 15, 3, 4,  true);
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (44, 27, 14, 2, 6,  true);
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
SELECT setval('docente_id_seq',         (SELECT COALESCE(MAX(id), 1) FROM docente));
SELECT setval('plan_seq',               (SELECT COALESCE(MAX(id), 1) FROM plan));
SELECT setval('categoria_seq',          (SELECT COALESCE(MAX(id), 1) FROM categoria));
SELECT setval('rol_seq',                (SELECT COALESCE(MAX(id), 1) FROM rol));
SELECT setval('cuatrimestre_seq',       (SELECT COALESCE(MAX(id), 1) FROM cuatrimestre));
