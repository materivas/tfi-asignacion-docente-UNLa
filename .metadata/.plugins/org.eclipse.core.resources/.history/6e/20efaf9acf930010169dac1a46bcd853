-- Script de datos iniciales para el sistema de gestión de docentes
-- Se ejecuta automáticamente al iniciar la aplicación

-- 1. Insertar Plan de estudios
INSERT INTO plan (id, nombre, descripcion) VALUES (1, 'Plan 2024', 'Plan de estudios actualizado 2024') ON CONFLICT (id) DO NOTHING;

-- 2. Insertar Materia
INSERT INTO materia (id, nombre, plan_id, anio) VALUES (1, 'Matemáticas I', 1, 1) ON CONFLICT (id) DO NOTHING;

-- 3. Insertar Cuatrimestre
INSERT INTO cuatrimestre (id, numero_cuatri) VALUES (1, 1) ON CONFLICT (id) DO NOTHING;

-- 4. Insertar Asignación
INSERT INTO asignacion (id, materia_id, cuatrimestre_id) VALUES (1, 1, 1) ON CONFLICT (id) DO NOTHING;

-- 5. Insertar Rol
INSERT INTO rol (id, nombre) VALUES (1, 'Titular') ON CONFLICT (id) DO NOTHING;

-- 6. Insertar Categoría
INSERT INTO categoria (id, nombre, max_materias) VALUES (1, 'Titular', 4) ON CONFLICT (id) DO NOTHING;

-- 7. Insertar Docente de ejemplo
INSERT INTO docente (id, nombre, dni, categoria_id) VALUES (1, 'Dr. Juan Pérez', '12345678', 1) ON CONFLICT (id) DO NOTHING;

-- 8. Insertar Asignación Docente
INSERT INTO asignacion_docente (id, asignacion_id, docente_id, rol_id, horas_asignadas, confirmado) VALUES (1, 1, 1, 1, 10, true) ON CONFLICT (id) DO NOTHING; 