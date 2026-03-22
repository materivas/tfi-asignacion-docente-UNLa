package com.gestion.backend.service;

import com.gestion.backend.model.Asignacion;
import com.gestion.backend.model.Materia;
import com.gestion.backend.model.Plan;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import com.gestion.backend.dto.MateriaDto;
import com.gestion.backend.repository.AsignacionRepository;
import com.gestion.backend.repository.AsignacionDocenteRepository;
import com.gestion.backend.repository.MateriaRepository;
import com.gestion.backend.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MateriaService {

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private AsignacionRepository asignacionRepository;

    @Autowired
    private AsignacionDocenteRepository asignacionDocenteRepository;

    public List<MateriaDto> listarTodos() {
        return materiaRepository.findAll().stream().map(MateriaDto::fromEntity).toList();
    }

    public Optional<MateriaDto> obtenerPorId(Long id) {
        return materiaRepository.findById(id).map(MateriaDto::fromEntity);
    }

    @Transactional
    public MateriaDto crear(MateriaDto dto) {
        Plan plan = planRepository.findById(dto.getPlanId())
            .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
        var materia = MateriaDto.toEntity(dto, plan);
        return MateriaDto.fromEntity(materiaRepository.save(materia));
    }

    @Transactional
    public MateriaDto actualizar(Long id, MateriaDto dto) {
        Plan plan = planRepository.findById(dto.getPlanId())
            .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
        return materiaRepository.findById(id).map(materia -> {
            materia.setNombre(dto.getNombre());
            materia.setPlan(plan);
            materia.setAnio(dto.getAnio());
            materia.setCodigo(dto.getCodigo());
            Materia materiaActualizada = materiaRepository.save(materia);
            actualizarComisionesAsignaciones(materiaActualizada.getId());
            return MateriaDto.fromEntity(materiaActualizada);
        }).orElseThrow(() -> new RuntimeException("Materia no encontrada"));
    }

    @Transactional
    public void eliminar(Long id) {
        // Primero eliminar asignacion_docentes y asignaciones relacionadas a esta materia
        List<Asignacion> asignaciones = asignacionRepository.findByMateriaId(id);
        if (!asignaciones.isEmpty()) {
            List<Long> asignacionIds = asignaciones.stream()
                    .map(Asignacion::getId)
                    .collect(Collectors.toList());
            asignacionDocenteRepository.deleteByAsignacionIdIn(asignacionIds);
            asignacionRepository.deleteByMateriaId(id);
        }
        materiaRepository.deleteById(id);
    }

    public Map<String, Object> importarMateriasDesdeExcel(MultipartFile archivo) throws IOException {
        List<String> errores = new ArrayList<>();
        List<String> filasIgnoradas = new ArrayList<>();
        int creados = 0;
        int ignorados = 0;

        // Cache planes en memoria para evitar consultas repetidas
        Map<String, Plan> planesPorNombre = new HashMap<>();
        for (Plan plan : planRepository.findAll()) {
            planesPorNombre.put(plan.getNombre().trim().toLowerCase(), plan);
        }

        // Cache nombres de materias existentes para validar duplicados
        Set<String> nombresExistentes = new HashSet<>();
        for (Materia m : materiaRepository.findAll()) {
            nombresExistentes.add(m.getNombre().trim().toLowerCase());
        }

        List<Materia> nuevasMaterias = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(archivo.getInputStream())) {
            Sheet hoja = workbook.getSheetAt(0);
            int lastRow = hoja.getLastRowNum();
            for (int i = 1; i <= lastRow; i++) {
                Row fila = hoja.getRow(i);
                if (fila == null) continue;
                try {
                    String nombre = obtenerTexto(fila.getCell(0));
                    String nombrePlan = obtenerTexto(fila.getCell(1));
                    String anioStr = obtenerTexto(fila.getCell(2));
                    String codigoStr = obtenerTexto(fila.getCell(3));
                    
                    // Ignorar filas completamente vacías
                    if (nombre.isEmpty() && nombrePlan.isEmpty() && anioStr.isEmpty()) {
                        continue;
                    }
                    
                    // Ignorar filas con datos parciales (sin reportar error)
                    if (nombre.isEmpty() || nombrePlan.isEmpty()) {
                        filasIgnoradas.add("Fila " + (i + 1) + ": datos incompletos");
                        ignorados++;
                        continue;
                    }
                    
                    // Validar nombre duplicado
                    if (nombresExistentes.contains(nombre.trim().toLowerCase())) {
                        filasIgnoradas.add("Fila " + (i + 1) + ": '" + nombre + "' ya existe");
                        ignorados++;
                        continue;
                    }
                    
                    Plan plan = planesPorNombre.get(nombrePlan.trim().toLowerCase());
                    if (plan == null) {
                        errores.add("Fila " + (i + 1) + ": Plan no encontrado: " + nombrePlan);
                        continue;
                    }
                    Materia nueva = new Materia();
                    nueva.setNombre(nombre);
                    nueva.setPlan(plan);
                    if (!anioStr.isEmpty()) {
                        try {
                            nueva.setAnio(Integer.parseInt(anioStr));
                        } catch (NumberFormatException e) {
                            errores.add("Fila " + (i + 1) + ": año inválido");
                            continue;
                        }
                    }
                    if (!codigoStr.isEmpty()) {
                        try {
                            nueva.setCodigo(Integer.parseInt(codigoStr));
                        } catch (NumberFormatException e) {
                            errores.add("Fila " + (i + 1) + ": código inválido");
                            continue;
                        }
                    }
                    nuevasMaterias.add(nueva);
                    nombresExistentes.add(nombre.trim().toLowerCase());
                    creados++;
                } catch (Exception e) {
                    errores.add("Fila " + (i + 1) + ": " + e.getMessage());
                }
            }
            // Guardar todas las nuevas materias en lote
            if (!nuevasMaterias.isEmpty()) {
                materiaRepository.saveAll(nuevasMaterias);
            }
        }
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("creados", creados);
        resultado.put("ignorados", ignorados);
        resultado.put("filasIgnoradas", filasIgnoradas);
        resultado.put("errores", errores);
        return resultado;
    }

    private String obtenerTexto(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                double val = cell.getNumericCellValue();
                if (val == (long) val) yield String.valueOf((long) val).trim();
                else yield String.valueOf(val).trim();
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }

    private void actualizarComisionesAsignaciones(Long materiaId) {
        List<Asignacion> asignaciones = asignacionRepository.findByMateriaId(materiaId);
        if (asignaciones.isEmpty()) {
            return;
        }

        for (Asignacion asignacion : asignaciones) {
            asignacion.generarComision();
        }

        asignacionRepository.saveAll(asignaciones);
    }
}
