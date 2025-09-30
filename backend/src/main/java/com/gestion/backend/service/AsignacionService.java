package com.gestion.backend.service;

import com.gestion.backend.dto.AsignacionDto;
import com.gestion.backend.model.Asignacion;
import com.gestion.backend.model.Materia;
import com.gestion.backend.model.Cuatrimestre;
import com.gestion.backend.repository.AsignacionRepository;
import com.gestion.backend.repository.MateriaRepository;
import com.gestion.backend.repository.CuatrimestreRepository;
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
public class AsignacionService {

    @Autowired
    private AsignacionRepository asignacionRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private CuatrimestreRepository cuatrimestreRepository;

    public List<AsignacionDto> listarTodos() {
        return asignacionRepository.findAll().stream().map(AsignacionDto::fromEntity).toList();
    }

    public Optional<AsignacionDto> obtenerPorId(Long id) {
        return asignacionRepository.findById(id).map(AsignacionDto::fromEntity);
    }

    @Transactional
    public AsignacionDto crear(AsignacionDto dto) {
        Materia materia = materiaRepository.findById(dto.getMateriaId())
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        Cuatrimestre cuatrimestre = cuatrimestreRepository.findById(dto.getCuatrimestreId())
            .orElseThrow(() -> new RuntimeException("Cuatrimestre no encontrada"));

        var asignacion = AsignacionDto.toEntity(dto, materia, cuatrimestre);
        asignacion.setId(null); 

        return AsignacionDto.fromEntity(asignacionRepository.save(asignacion));
    }

    public AsignacionDto actualizar(Long id, AsignacionDto dto) {
        Materia materia = materiaRepository.findById(dto.getMateriaId())
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        Cuatrimestre cuatrimestre = cuatrimestreRepository.findById(dto.getCuatrimestreId())
            .orElseThrow(() -> new RuntimeException("Cuatrimestre no encontrado"));
        return asignacionRepository.findById(id).map(asignacion -> {
            asignacion.setMateria(materia);
            asignacion.setCuatrimestre(cuatrimestre);
            asignacion.setTurno(dto.getTurno());
            asignacion.setAnio(dto.getAnio());
            asignacion.setDia(dto.getDia());
            return AsignacionDto.fromEntity(asignacionRepository.save(asignacion));
        }).orElseThrow(() -> new RuntimeException("Asignacion no encontrada"));
    }

    public void eliminar(Long id) {
        asignacionRepository.deleteById(id);
    }

    public Map<String, Object> importarAsignacionesDesdeExcel(MultipartFile archivo) throws IOException {
        List<String> errores = new ArrayList<>();
        int creados = 0;
        int ignorados = 0;

        // Cache materias en memoria para evitar consultas repetidas
        Map<String, Materia> materiasPorNombre = new HashMap<>();
        for (Materia materia : materiaRepository.findAll()) {
            materiasPorNombre.put(materia.getNombre().trim().toLowerCase(), materia);
        }

        // Cache cuatrimestres en memoria
        Map<Integer, Cuatrimestre> cuatrimestresPorNumero = new HashMap<>();
        for (Cuatrimestre cuatrimestre : cuatrimestreRepository.findAll()) {
            cuatrimestresPorNumero.put(cuatrimestre.getNumeroCuatri(), cuatrimestre);
        }

        List<Asignacion> nuevasAsignaciones = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(archivo.getInputStream())) {
            Sheet hoja = workbook.getSheetAt(0);
            int lastRow = hoja.getLastRowNum();
            for (int i = 1; i <= lastRow; i++) {
                Row fila = hoja.getRow(i);
                if (fila == null) continue;
                try {
                    String nombreMateria = obtenerTexto(fila.getCell(0));
                    String numeroCuatriStr = obtenerTexto(fila.getCell(1));
                    String turno = obtenerTexto(fila.getCell(2));
                    String anioStr = obtenerTexto(fila.getCell(3));
                    String dia = obtenerTexto(fila.getCell(4));
                    if (nombreMateria.isEmpty() || numeroCuatriStr.isEmpty()) {
                        errores.add("Fila " + (i + 1) + ": campos incompletos");
                        continue;
                    }
                    Materia materia = materiasPorNombre.get(nombreMateria.trim().toLowerCase());
                    if (materia == null) {
                        errores.add("Fila " + (i + 1) + ": Materia no encontrada: " + nombreMateria);
                        continue;
                    }
                    Integer numeroCuatri;
                    try {
                        numeroCuatri = Integer.parseInt(numeroCuatriStr.trim());
                    } catch (NumberFormatException e) {
                        errores.add("Fila " + (i + 1) + ": número de cuatrimestre inválido");
                        continue;
                    }
                    Cuatrimestre cuatrimestre = cuatrimestresPorNumero.get(numeroCuatri);
                    if (cuatrimestre == null) {
                        errores.add("Fila " + (i + 1) + ": Cuatrimestre no encontrado: " + numeroCuatri);
                        continue;
                    }
                    Asignacion nueva = new Asignacion();
                    nueva.setMateria(materia);
                    nueva.setCuatrimestre(cuatrimestre);
                    nueva.setTurno(turno);
                    nueva.setDia(dia);
                    if (!anioStr.isEmpty()) {
                        try {
                            nueva.setAnio(Integer.parseInt(anioStr.trim()));
                        } catch (NumberFormatException e) {
                            errores.add("Fila " + (i + 1) + ": año inválido");
                        }
                    }
                    nuevasAsignaciones.add(nueva);
                    creados++;
                } catch (Exception e) {
                    errores.add("Fila " + (i + 1) + ": " + e.getMessage());
                }
            }
            // Guardar todas las nuevas asignaciones en lote
            if (!nuevasAsignaciones.isEmpty()) {
                asignacionRepository.saveAll(nuevasAsignaciones);
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
