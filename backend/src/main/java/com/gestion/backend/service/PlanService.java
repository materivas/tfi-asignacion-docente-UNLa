package com.gestion.backend.service;

import com.gestion.backend.dto.PlanDto;
import com.gestion.backend.model.Plan;
import com.gestion.backend.repository.PlanRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.List;
import java.util.Optional;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;

    public List<PlanDto> listarTodos() {
        return planRepository.findAll().stream().map(PlanDto::fromEntity).toList();
    }

    public Optional<PlanDto> obtenerPorId(Long id) {
        return planRepository.findById(id).map(PlanDto::fromEntity);
    }

    public PlanDto crear(PlanDto dto) {
        var plan = PlanDto.toEntity(dto);
        return PlanDto.fromEntity(planRepository.save(plan));
    }

    public PlanDto actualizar(Long id, PlanDto dto) {
        return planRepository.findById(id).map(plan -> {
            plan.setNombre(dto.getNombre());
            plan.setDescripcion(dto.getDescripcion());
            return PlanDto.fromEntity(planRepository.save(plan));
        }).orElseThrow(() -> new RuntimeException("Plan no encontrado"));
    }

    public void eliminar(Long id) {
        planRepository.deleteById(id);
    }

    public Map<String, Object> importarPlanesDesdeExcel(MultipartFile archivo) throws IOException {
        List<String> errores = new ArrayList<>();
        int creados = 0;
        int ignorados = 0;

        // Cache planes en memoria para evitar duplicados
        Map<String, Plan> planesPorNombre = new HashMap<>();
        for (Plan plan : planRepository.findAll()) {
            planesPorNombre.put(plan.getNombre().trim().toLowerCase(), plan);
        }

        List<Plan> nuevosPlanes = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(archivo.getInputStream())) {
            Sheet hoja = workbook.getSheetAt(0);
            int lastRow = hoja.getLastRowNum();
            for (int i = 1; i <= lastRow; i++) {
                Row fila = hoja.getRow(i);
                if (fila == null) continue;
                try {
                    String nombre = obtenerTexto(fila.getCell(0));
                    String descripcion = obtenerTexto(fila.getCell(1));
                    if (nombre.isEmpty()) {
                        errores.add("Fila " + (i + 1) + ": campo nombre incompleto");
                        continue;
                    }
                    Plan planExistente = planesPorNombre.get(nombre.trim().toLowerCase());
                    if (planExistente != null) {
                        // Ignorar duplicados
                        ignorados++;
                        continue;
                    }
                    Plan nuevo = new Plan();
                    nuevo.setNombre(nombre);
                    nuevo.setDescripcion(descripcion);
                    nuevosPlanes.add(nuevo);
                    creados++;
                } catch (Exception e) {
                    errores.add("Fila " + (i + 1) + ": " + e.getMessage());
                }
            }
            if (!nuevosPlanes.isEmpty()) {
                planRepository.saveAll(nuevosPlanes);
            }
        }

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("creados", creados);
        resultado.put("ignorados", ignorados);
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
}
