package com.gestion.backend.service;

import com.gestion.backend.dto.AsignacionDocenteDto;
import com.gestion.backend.model.AsignacionDocente;
import com.gestion.backend.model.Asignacion;
import com.gestion.backend.model.Docente;
import com.gestion.backend.model.Rol;
import com.gestion.backend.repository.AsignacionDocenteRepository;
import com.gestion.backend.repository.AsignacionRepository;
import com.gestion.backend.repository.DocenteRepository;
import com.gestion.backend.repository.RolRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.List;
import java.util.Optional;

@Service
public class AsignacionDocenteService {

    @Autowired
    private AsignacionDocenteRepository asignacionDocenteRepository;

    @Autowired
    private AsignacionRepository asignacionRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private RolRepository rolRepository;

    public List<AsignacionDocenteDto> listarTodos() {
        return asignacionDocenteRepository.findAll().stream().map(AsignacionDocenteDto::fromEntity).toList();
    }

    public Optional<AsignacionDocenteDto> obtenerPorId(Long id) {
        return asignacionDocenteRepository.findById(id).map(AsignacionDocenteDto::fromEntity);
    }

    @Transactional
    public AsignacionDocenteDto crear(AsignacionDocenteDto dto) {
        Asignacion asignacion = asignacionRepository.findById(dto.getAsignacionId())
            .orElseThrow(() -> new RuntimeException("Asignacion no encontrada"));
        Docente docente = docenteRepository.findById(dto.getDocenteId())
            .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
        Rol rol = rolRepository.findById(dto.getRolId())
            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        var asignacionDocente = AsignacionDocenteDto.toEntity(dto, asignacion, docente, rol);
        return AsignacionDocenteDto.fromEntity(asignacionDocenteRepository.save(asignacionDocente));
    }

    public AsignacionDocenteDto actualizar(Long id, AsignacionDocenteDto dto) {
        Asignacion asignacion = asignacionRepository.findById(dto.getAsignacionId())
            .orElseThrow(() -> new RuntimeException("Asignacion no encontrada"));
        Docente docente = docenteRepository.findById(dto.getDocenteId())
            .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
        Rol rol = rolRepository.findById(dto.getRolId())
            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        return asignacionDocenteRepository.findById(id).map(asignacionDocente -> {
            asignacionDocente.setAsignacion(asignacion);
            asignacionDocente.setDocente(docente);
            asignacionDocente.setRol(rol);
            asignacionDocente.setHorasAsignadas(dto.getHorasAsignadas());
            asignacionDocente.setConfirmado(dto.getConfirmado());
            return AsignacionDocenteDto.fromEntity(asignacionDocenteRepository.save(asignacionDocente));
        }).orElseThrow(() -> new RuntimeException("AsignacionDocente no encontrada"));
    }

    public void eliminar(Long id) {
        asignacionDocenteRepository.deleteById(id);
    }

    public Map<String, Object> importarAsignacionDocentesDesdeExcel(org.springframework.web.multipart.MultipartFile archivo) throws java.io.IOException {
        List<String> errores = new ArrayList<>();
        int creados = 0;
        int ignorados = 0;

        // Cache asignaciones en memoria para evitar consultas repetidas
        Map<Long, com.gestion.backend.model.Asignacion> asignacionesPorId = new HashMap<>();
        for (com.gestion.backend.model.Asignacion asignacion : asignacionRepository.findAll()) {
            asignacionesPorId.put(asignacion.getId(), asignacion);
        }

        // Cache docentes en memoria
        Map<Long, com.gestion.backend.model.Docente> docentesPorId = new HashMap<>();
        for (com.gestion.backend.model.Docente docente : docenteRepository.findAll()) {
            docentesPorId.put(docente.getId(), docente);
        }

        // Cache roles en memoria
        Map<Long, com.gestion.backend.model.Rol> rolesPorId = new HashMap<>();
        for (com.gestion.backend.model.Rol rol : rolRepository.findAll()) {
            rolesPorId.put(rol.getId(), rol);
        }

        List<com.gestion.backend.model.AsignacionDocente> nuevasAsignacionesDocente = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(archivo.getInputStream())) {
            Sheet hoja = workbook.getSheetAt(0);
            int lastRow = hoja.getLastRowNum();
            for (int i = 1; i <= lastRow; i++) {
                Row fila = hoja.getRow(i);
                if (fila == null) continue;
                try {
                    String asignacionIdStr = obtenerTexto(fila.getCell(0));
                    String docenteIdStr = obtenerTexto(fila.getCell(1));
                    String rolIdStr = obtenerTexto(fila.getCell(2));
                    String horasAsignadasStr = obtenerTexto(fila.getCell(3));
                    String confirmadoStr = obtenerTexto(fila.getCell(4));

                    if (asignacionIdStr.isEmpty() || docenteIdStr.isEmpty() || rolIdStr.isEmpty() || horasAsignadasStr.isEmpty() || confirmadoStr.isEmpty()) {
                        errores.add("Fila " + (i + 1) + ": campos incompletos");
                        continue;
                    }

                    Long asignacionId, docenteId, rolId;
                    Integer horasAsignadas;
                    Boolean confirmado;

                    try {
                        asignacionId = Long.parseLong(asignacionIdStr.trim());
                        docenteId = Long.parseLong(docenteIdStr.trim());
                        rolId = Long.parseLong(rolIdStr.trim());
                        horasAsignadas = Integer.parseInt(horasAsignadasStr.trim());
                        confirmado = Boolean.parseBoolean(confirmadoStr.trim());
                    } catch (NumberFormatException e) {
                        errores.add("Fila " + (i + 1) + ": formato numérico inválido");
                        continue;
                    }

                    com.gestion.backend.model.Asignacion asignacion = asignacionesPorId.get(asignacionId);
                    if (asignacion == null) {
                        errores.add("Fila " + (i + 1) + ": Asignacion no encontrada: " + asignacionId);
                        continue;
                    }

                    com.gestion.backend.model.Docente docente = docentesPorId.get(docenteId);
                    if (docente == null) {
                        errores.add("Fila " + (i + 1) + ": Docente no encontrado: " + docenteId);
                        continue;
                    }

                    com.gestion.backend.model.Rol rol = rolesPorId.get(rolId);
                    if (rol == null) {
                        errores.add("Fila " + (i + 1) + ": Rol no encontrado: " + rolId);
                        continue;
                    }

                    com.gestion.backend.model.AsignacionDocente nueva = new com.gestion.backend.model.AsignacionDocente();
                    nueva.setAsignacion(asignacion);
                    nueva.setDocente(docente);
                    nueva.setRol(rol);
                    nueva.setHorasAsignadas(horasAsignadas);
                    nueva.setConfirmado(confirmado);

                    nuevasAsignacionesDocente.add(nueva);
                    creados++;
                } catch (Exception e) {
                    errores.add("Fila " + (i + 1) + ": " + e.getMessage());
                }
            }
            if (!nuevasAsignacionesDocente.isEmpty()) {
                asignacionDocenteRepository.saveAll(nuevasAsignacionesDocente);
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
