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

    @Transactional
    public void eliminar(Long id) {
        asignacionDocenteRepository.deleteByAsignacionId(id);
        asignacionRepository.deleteById(id);
    }

    /**
     * Exporta un Excel con formato tabular: Año | Materia | Profesor | Dia y Turno.
     * Las filas del mismo año de materia se agrupan con merge en la columna Año.
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

        // Labels para turnos y días - normalización robusta que soporta cualquier variante de encoding
        // (ej: "Mañana", "Maniana", "MaÃ±ana", etc.)
        Map<String, String> turnoLabels = new HashMap<>();
        turnoLabels.put("Maniana", "Mañana");
        turnoLabels.put("Mañana", "Mañana");
        turnoLabels.put("Ma\u00c3\u00b1ana", "Mañana"); // doble-encoding UTF-8
        turnoLabels.put("Tarde", "Tarde");
        turnoLabels.put("Noche", "Noche");

        Map<String, String> diaLabels = new HashMap<>();
        diaLabels.put("Lunes", "Lunes");
        diaLabels.put("Martes", "Martes");
        diaLabels.put("Miercoles", "Mi\u00e9rcoles");
        diaLabels.put("Mi\u00e9rcoles", "Mi\u00e9rcoles");
        diaLabels.put("Jueves", "Jueves");
        diaLabels.put("Viernes", "Viernes");
        diaLabels.put("Sabado", "S\u00e1bado");
        diaLabels.put("S\u00e1bado", "S\u00e1bado");

        // Agrupar asignaciones por año de materia, ordenado
        Map<Integer, List<Asignacion>> asignacionesPorAnioMateria = new TreeMap<>();
        for (Asignacion a : todasAsignaciones) {
            if (a.getMateria() != null && a.getMateria().getAnio() != null) {
                asignacionesPorAnioMateria
                        .computeIfAbsent(a.getMateria().getAnio(), k -> new ArrayList<>())
                        .add(a);
            }
        }

        try (Workbook workbook = new XSSFWorkbook()) {
            // ── Estilos ──
            // Estilo de encabezado
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

            // Estilo para la columna Año (centrado vertical y horizontal)
            CellStyle anioStyle = workbook.createCellStyle();
            Font anioFont = workbook.createFont();
            anioFont.setBold(true);
            anioFont.setFontHeightInPoints((short) 11);
            anioStyle.setFont(anioFont);
            anioStyle.setAlignment(HorizontalAlignment.CENTER);
            anioStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            anioStyle.setBorderBottom(BorderStyle.THIN);
            anioStyle.setBorderTop(BorderStyle.THIN);
            anioStyle.setBorderLeft(BorderStyle.THIN);
            anioStyle.setBorderRight(BorderStyle.THIN);

            // Estilo para celdas de datos
            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            cellStyle.setWrapText(true);
            cellStyle.setBorderBottom(BorderStyle.THIN);
            cellStyle.setBorderTop(BorderStyle.THIN);
            cellStyle.setBorderLeft(BorderStyle.THIN);
            cellStyle.setBorderRight(BorderStyle.THIN);
            cellStyle.setAlignment(HorizontalAlignment.LEFT);

            // Estilo de título
            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleFont.setColor(IndexedColors.DARK_RED.getIndex());
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.LEFT);

            Sheet sheet = workbook.createSheet("Calendario");

            // Título
            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            String titulo = "Calendario de Asignaciones";
            if (anioCalendario != null) titulo += " - Año " + anioCalendario;
            if (cuatrimestreNum != null) titulo += " - Cuatrimestre " + cuatrimestreNum;
            titleCell.setCellValue(titulo);
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 3));

            // Encabezados: Año | Materia | Profesor | Dia y Turno
            Row headerRow = sheet.createRow(2);
            String[] headers = {"Año", "Materia", "Profesor", "Dia y Turno"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIndex = 3;

            // Recorrer por cada año de materia agrupado
            for (Map.Entry<Integer, List<Asignacion>> entry : asignacionesPorAnioMateria.entrySet()) {
                int anioMateria = entry.getKey();
                List<Asignacion> asignacionesAnio = entry.getValue();

                // Ordenar por nombre de materia
                asignacionesAnio.sort(Comparator.comparing(a -> a.getMateria() != null ? a.getMateria().getNombre() : ""));

                int startRowForAnio = rowIndex;

                for (Asignacion asig : asignacionesAnio) {
                    Row row = sheet.createRow(rowIndex);

                    // Columna Materia
                    String nombreMateria = asig.getMateria() != null ? asig.getMateria().getNombre() : "Sin materia";
                    Cell materiaCell = row.createCell(1);
                    materiaCell.setCellValue(nombreMateria);
                    materiaCell.setCellStyle(cellStyle);

                    // Columna Profesor: docentes separados por " / "
                    List<AsignacionDocente> docentes = docentesPorAsignacion
                            .getOrDefault(asig.getId(), Collections.emptyList());

                    String profesores;
                    if (docentes.isEmpty()) {
                        profesores = "Sin docente asignado";
                    } else {
                        profesores = docentes.stream()
                                .filter(ad -> ad.getConfirmado() != null && ad.getConfirmado())
                                .map(ad -> ad.getDocente() != null ? ad.getDocente().getNombre() : "?")
                                .collect(Collectors.joining(" / "));
                        if (profesores.isEmpty()) {
                            // Si nadie está confirmado, mostrar todos con indicador
                            profesores = docentes.stream()
                                    .map(ad -> {
                                        String nombre = ad.getDocente() != null ? ad.getDocente().getNombre() : "?";
                                        return nombre + " (?)";
                                    })
                                    .collect(Collectors.joining(" / "));
                        }
                    }
                    Cell profCell = row.createCell(2);
                    profCell.setCellValue(profesores);
                    profCell.setCellStyle(cellStyle);

                    // Columna Dia y Turno
                    String dia = asig.getDia() != null ? diaLabels.getOrDefault(asig.getDia(), asig.getDia()) : "";
                    String turnoRaw = asig.getTurno() != null ? asig.getTurno() : "";
                    String turno = turnoLabels.getOrDefault(turnoRaw, null);
                    if (turno == null && !turnoRaw.isEmpty()) {
                        // Fallback: detectar por prefijo para manejar encoding corrupto
                        String lower = turnoRaw.toLowerCase();
                        if (lower.startsWith("ma")) {
                            turno = "Mañana";
                        } else if (lower.startsWith("ta")) {
                            turno = "Tarde";
                        } else if (lower.startsWith("no")) {
                            turno = "Noche";
                        } else {
                            turno = turnoRaw;
                        }
                    } else if (turno == null) {
                        turno = "";
                    }
                    String diaYTurno = "";
                    if (!dia.isEmpty() && !turno.isEmpty()) {
                        diaYTurno = dia + " turno " + turno;
                    } else if (!dia.isEmpty()) {
                        diaYTurno = dia;
                    } else if (!turno.isEmpty()) {
                        diaYTurno = "Turno " + turno;
                    }
                    Cell diaCell = row.createCell(3);
                    diaCell.setCellValue(diaYTurno);
                    diaCell.setCellStyle(cellStyle);

                    rowIndex++;
                }

                // Columna Año: escribir en la primera fila del grupo y mergear si hay más de una
                int endRowForAnio = rowIndex - 1;
                Row firstRow = sheet.getRow(startRowForAnio);
                Cell anioCell = firstRow.createCell(0);
                anioCell.setCellValue(anioMateria + "° año");
                anioCell.setCellStyle(anioStyle);

                if (endRowForAnio > startRowForAnio) {
                    sheet.addMergedRegion(new CellRangeAddress(startRowForAnio, endRowForAnio, 0, 0));
                    // Aplicar estilo a las celdas mergeadas vacías para que tengan bordes
                    for (int r = startRowForAnio + 1; r <= endRowForAnio; r++) {
                        Row mergedRow = sheet.getRow(r);
                        if (mergedRow != null) {
                            Cell emptyAnioCell = mergedRow.createCell(0);
                            emptyAnioCell.setCellStyle(anioStyle);
                        }
                    }
                }
            }

            // Ajustar anchos de columnas
            sheet.setColumnWidth(0, 4000);  // Año
            sheet.setColumnWidth(1, 8000);  // Materia
            sheet.setColumnWidth(2, 10000); // Profesor
            sheet.setColumnWidth(3, 8000);  // Dia y Turno

            // Si no hay datos, mostrar mensaje
            if (asignacionesPorAnioMateria.isEmpty()) {
                Row row = sheet.createRow(3);
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
