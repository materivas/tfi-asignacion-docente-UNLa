package com.gestion.backend.service;

import com.gestion.backend.dto.AsignacionDto;
import com.gestion.backend.model.Asignacion;
import com.gestion.backend.model.AsignacionDocente;
import com.gestion.backend.model.Materia;
import com.gestion.backend.model.Cuatrimestre;
import com.gestion.backend.repository.AsignacionRepository;
import com.gestion.backend.repository.AsignacionDocenteRepository;
import com.gestion.backend.repository.MateriaRepository;
import com.gestion.backend.repository.CuatrimestreRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AsignacionService {

    @Autowired
    private AsignacionRepository asignacionRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private CuatrimestreRepository cuatrimestreRepository;

    @Autowired
    private AsignacionDocenteRepository asignacionDocenteRepository;

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

    /**
     * Exporta un calendario tipo Excel con los docentes asignados a cada materia,
     * organizado por día y turno. Genera una hoja por cada año de la carrera (1° a 5°).
     */
    public ByteArrayOutputStream exportarCalendarioExcel(Integer anioCalendario, Integer cuatrimestreNum) throws IOException {
        List<Asignacion> todasAsignaciones = asignacionRepository.findAll();
        List<AsignacionDocente> todasAsignacionesDocentes = asignacionDocenteRepository.findAll();

        // Filtrar por año calendario si se especifica
        if (anioCalendario != null) {
            todasAsignaciones = todasAsignaciones.stream()
                    .filter(a -> anioCalendario.equals(a.getAnio()))
                    .collect(Collectors.toList());
        }

        // Filtrar por cuatrimestre si se especifica
        if (cuatrimestreNum != null) {
            todasAsignaciones = todasAsignaciones.stream()
                    .filter(a -> a.getCuatrimestre() != null && cuatrimestreNum.equals(a.getCuatrimestre().getNumeroCuatri()))
                    .collect(Collectors.toList());
        }

        // Mapa asignacionId -> lista de AsignacionDocente
        Map<Long, List<AsignacionDocente>> docentesPorAsignacion = new HashMap<>();
        for (AsignacionDocente ad : todasAsignacionesDocentes) {
            if (ad.getAsignacion() != null && ad.getAsignacion().getId() != null) {
                docentesPorAsignacion
                        .computeIfAbsent(ad.getAsignacion().getId(), k -> new ArrayList<>())
                        .add(ad);
            }
        }

        // Agrupar asignaciones por año de materia
        Map<Integer, List<Asignacion>> asignacionesPorAnioMateria = new TreeMap<>();
        for (Asignacion a : todasAsignaciones) {
            if (a.getMateria() != null && a.getMateria().getAnio() != null) {
                asignacionesPorAnioMateria
                        .computeIfAbsent(a.getMateria().getAnio(), k -> new ArrayList<>())
                        .add(a);
            }
        }

        String[] dias = {"Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"};
        String[] turnos = {"Maniana", "Tarde", "Noche"};
        Map<String, String> turnoLabels = Map.of("Maniana", "Mañana", "Tarde", "Tarde", "Noche", "Noche");

        try (Workbook workbook = new XSSFWorkbook()) {
            // Estilos
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 12);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_RED.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);
            headerStyle.setWrapText(true);

            CellStyle turnoStyle = workbook.createCellStyle();
            Font turnoFont = workbook.createFont();
            turnoFont.setBold(true);
            turnoFont.setFontHeightInPoints((short) 11);
            turnoStyle.setFont(turnoFont);
            turnoStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            turnoStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            turnoStyle.setAlignment(HorizontalAlignment.CENTER);
            turnoStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            turnoStyle.setBorderBottom(BorderStyle.THIN);
            turnoStyle.setBorderTop(BorderStyle.THIN);
            turnoStyle.setBorderLeft(BorderStyle.THIN);
            turnoStyle.setBorderRight(BorderStyle.THIN);
            turnoStyle.setWrapText(true);

            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setVerticalAlignment(VerticalAlignment.TOP);
            cellStyle.setWrapText(true);
            cellStyle.setBorderBottom(BorderStyle.THIN);
            cellStyle.setBorderTop(BorderStyle.THIN);
            cellStyle.setBorderLeft(BorderStyle.THIN);
            cellStyle.setBorderRight(BorderStyle.THIN);
            cellStyle.setAlignment(HorizontalAlignment.LEFT);

            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleFont.setColor(IndexedColors.DARK_RED.getIndex());
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.LEFT);

            // Crear una hoja por cada año de la carrera
            for (Map.Entry<Integer, List<Asignacion>> entry : asignacionesPorAnioMateria.entrySet()) {
                int anioMateria = entry.getKey();
                List<Asignacion> asignacionesAnio = entry.getValue();

                Sheet sheet = workbook.createSheet(anioMateria + "° Año");

                // Título
                Row titleRow = sheet.createRow(0);
                Cell titleCell = titleRow.createCell(0);
                String titulo = anioMateria + "° Año";
                if (anioCalendario != null) titulo += " - Año " + anioCalendario;
                if (cuatrimestreNum != null) titulo += " - Cuatrimestre " + cuatrimestreNum;
                titleCell.setCellValue(titulo);
                titleCell.setCellStyle(titleStyle);
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, dias.length));

                // Encabezados: Turno | Lunes | Martes | Miércoles | Jueves | Viernes | Sábado
                Row headerRow = sheet.createRow(2);
                Cell cornerCell = headerRow.createCell(0);
                cornerCell.setCellValue("Turno");
                cornerCell.setCellStyle(headerStyle);
                for (int d = 0; d < dias.length; d++) {
                    Cell cell = headerRow.createCell(d + 1);
                    cell.setCellValue(dias[d]);
                    cell.setCellStyle(headerStyle);
                }

                int rowIndex = 3;

                // Para cada turno
                for (String turno : turnos) {
                    Row turnoRow = sheet.createRow(rowIndex);

                    // Celda del turno
                    Cell turnoCell = turnoRow.createCell(0);
                    turnoCell.setCellValue(turnoLabels.getOrDefault(turno, turno));
                    turnoCell.setCellStyle(turnoStyle);

                    // Para cada día
                    for (int d = 0; d < dias.length; d++) {
                        final String dia = dias[d];
                        final String turnoFinal = turno;

                        // Buscar asignaciones para este día/turno/año
                        List<Asignacion> asigsDiaTurno = asignacionesAnio.stream()
                                .filter(a -> dia.equals(a.getDia()) && turnoFinal.equals(a.getTurno()))
                                .sorted(Comparator.comparing(a -> a.getMateria() != null ? a.getMateria().getNombre() : ""))
                                .collect(Collectors.toList());

                        StringBuilder contenido = new StringBuilder();
                        for (Asignacion asig : asigsDiaTurno) {
                            if (contenido.length() > 0) contenido.append("\n\n");

                            // Nombre de la materia
                            String nombreMateria = asig.getMateria() != null ? asig.getMateria().getNombre() : "Sin materia";
                            contenido.append("📚 ").append(nombreMateria);

                            // Docentes asignados
                            List<AsignacionDocente> docentes = docentesPorAsignacion
                                    .getOrDefault(asig.getId(), Collections.emptyList());

                            if (docentes.isEmpty()) {
                                contenido.append("\n  ⚠ Sin docente asignado");
                            } else {
                                // Ordenar: confirmados primero, luego por rol
                                docentes.sort((d1, d2) -> {
                                    int c = Boolean.compare(d2.getConfirmado() != null && d2.getConfirmado(),
                                            d1.getConfirmado() != null && d1.getConfirmado());
                                    if (c != 0) return c;
                                    String r1 = d1.getRol() != null ? d1.getRol().getNombre() : "";
                                    String r2 = d2.getRol() != null ? d2.getRol().getNombre() : "";
                                    return r1.compareTo(r2);
                                });

                                for (AsignacionDocente ad : docentes) {
                                    String nombreDocente = ad.getDocente() != null ? ad.getDocente().getNombre() : "?";
                                    String rol = ad.getRol() != null ? ad.getRol().getNombre() : "";
                                    String estado = (ad.getConfirmado() != null && ad.getConfirmado()) ? "✓" : "?";
                                    contenido.append("\n  ").append(estado).append(" ").append(nombreDocente);
                                    if (!rol.isEmpty()) contenido.append(" (").append(rol).append(")");
                                }
                            }
                        }

                        Cell cell = turnoRow.createCell(d + 1);
                        cell.setCellValue(contenido.toString());
                        cell.setCellStyle(cellStyle);
                    }

                    rowIndex++;
                }

                // Ajustar anchos de columnas
                sheet.setColumnWidth(0, 4000); // Turno
                for (int d = 0; d < dias.length; d++) {
                    sheet.setColumnWidth(d + 1, 10000); // Cada día
                }

                // Ajustar alturas de filas de datos
                for (int r = 3; r < rowIndex; r++) {
                    Row row = sheet.getRow(r);
                    if (row != null) {
                        row.setHeightInPoints(Math.max(100, row.getHeightInPoints()));
                    }
                }
            }

            // Si no hay datos, crear hoja vacía con mensaje
            if (asignacionesPorAnioMateria.isEmpty()) {
                Sheet sheet = workbook.createSheet("Sin datos");
                Row row = sheet.createRow(0);
                row.createCell(0).setCellValue("No se encontraron asignaciones para los filtros seleccionados.");
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos;
        }
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
