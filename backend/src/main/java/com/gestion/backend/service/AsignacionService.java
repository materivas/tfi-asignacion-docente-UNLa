package com.gestion.backend.service;

import com.gestion.backend.dto.AsignacionDto;
import com.gestion.backend.exception.ConflictoHorarioException;
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
import java.text.Normalizer;
import java.util.*;
import java.util.Locale;
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
            validarConflictosAlMoverAsignacion(id, dto.getAnio(), dto.getDia(), dto.getTurno());
            asignacion.setMateria(materia);
            asignacion.setCuatrimestre(cuatrimestre);
            asignacion.setTurno(dto.getTurno());
            asignacion.setAnio(dto.getAnio());
            asignacion.setDia(dto.getDia());
            asignacion.generarComision();
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

        if (anioCalendario != null) {
            todasAsignaciones = todasAsignaciones.stream()
                    .filter(a -> anioCalendario.equals(a.getAnio()))
                    .collect(Collectors.toList());
        }

        if (cuatrimestreNum != null) {
            todasAsignaciones = todasAsignaciones.stream()
                    .filter(a -> a.getCuatrimestre() != null && cuatrimestreNum.equals(a.getCuatrimestre().getNumeroCuatri()))
                    .collect(Collectors.toList());
        }

        Map<Long, List<AsignacionDocente>> docentesPorAsignacion = new HashMap<>();
        for (AsignacionDocente ad : todasAsignacionesDocentes) {
            if (ad.getAsignacion() != null && ad.getAsignacion().getId() != null) {
                docentesPorAsignacion
                        .computeIfAbsent(ad.getAsignacion().getId(), k -> new ArrayList<>())
                        .add(ad);
            }
        }

        Map<String, String> turnoLabels = new HashMap<>();
        turnoLabels.put("Maniana", "Ma\u00f1ana");
        turnoLabels.put("Manana", "Ma\u00f1ana");
        turnoLabels.put("Ma\u00f1ana", "Ma\u00f1ana");
        turnoLabels.put("Ma??ana", "Ma\u00f1ana");
        turnoLabels.put("Ma\u00c3\u00b1ana", "Ma\u00f1ana");
        turnoLabels.put("Tarde", "Tarde");
        turnoLabels.put("Noche", "Noche");

        List<Asignacion> asignacionesOrdenadas = new ArrayList<>(todasAsignaciones);
        asignacionesOrdenadas.sort(
                Comparator
                        .comparing((Asignacion a) -> a.getMateria() != null && a.getMateria().getAnio() != null ? a.getMateria().getAnio() : Integer.MAX_VALUE)
                        .thenComparing(a -> a.getComision() != null ? a.getComision() : "")
                        .thenComparing(a -> a.getMateria() != null ? a.getMateria().getNombre() : "")
        );

        try (Workbook workbook = new XSSFWorkbook()) {
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

            CellStyle cellStyle = workbook.createCellStyle();
            cellStyle.setVerticalAlignment(VerticalAlignment.CENTER);
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

            Sheet sheet = workbook.createSheet("Calendario");

            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            String titulo = "Calendario de Asignaciones";
            if (anioCalendario != null) titulo += " - A\u00f1o " + anioCalendario;
            if (cuatrimestreNum != null) titulo += " - Cuatrimestre " + cuatrimestreNum;
            titleCell.setCellValue(titulo);
            titleCell.setCellStyle(titleStyle);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 6));

            Row headerRow = sheet.createRow(2);
            String[] headers = {"Año", "Codigo", "Comision", "Asignatura", "Profesores", "Día", "Turnos"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIndex = 3;

            for (Asignacion asig : asignacionesOrdenadas) {
                Row row = sheet.createRow(rowIndex);

                String anioMateria = asig.getMateria() != null && asig.getMateria().getAnio() != null
                        ? String.valueOf(asig.getMateria().getAnio())
                        : "";
                Cell anioCell = row.createCell(0);
                anioCell.setCellValue(anioMateria);
                anioCell.setCellStyle(cellStyle);

                String codigoMateria = resolverCodigoMateria(asig);
                Cell codigoCell = row.createCell(1);
                codigoCell.setCellValue(codigoMateria);
                codigoCell.setCellStyle(cellStyle);

                Cell comisionCell = row.createCell(2);
                comisionCell.setCellValue(resolverComision(asig));
                comisionCell.setCellStyle(cellStyle);

                String nombreMateria = asig.getMateria() != null ? asig.getMateria().getNombre() : "Sin materia";
                Cell materiaCell = row.createCell(3);
                materiaCell.setCellValue(nombreMateria);
                materiaCell.setCellStyle(cellStyle);

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
                        profesores = docentes.stream()
                                .map(ad -> {
                                    String nombre = ad.getDocente() != null ? ad.getDocente().getNombre() : "?";
                                    return nombre + " (?)";
                                })
                                .collect(Collectors.joining(" / "));
                    }
                }
                Cell profCell = row.createCell(4);
                profCell.setCellValue(profesores);
                profCell.setCellStyle(cellStyle);

                String diaRaw = asig.getDia() != null ? asig.getDia() : "";
                Cell diaCell = row.createCell(5);
                diaCell.setCellValue(diaRaw);
                diaCell.setCellStyle(cellStyle);

                String turnoRaw = asig.getTurno() != null ? asig.getTurno() : "";
                String turno = turnoLabels.getOrDefault(turnoRaw, turnoRaw);
                Cell turnoCell = row.createCell(6);
                turnoCell.setCellValue(turno);
                turnoCell.setCellStyle(cellStyle);

                rowIndex++;
            }

            sheet.setColumnWidth(0, 3500);
            sheet.setColumnWidth(1, 5000);
            sheet.setColumnWidth(2, 5000);
            sheet.setColumnWidth(3, 9000);
            sheet.setColumnWidth(4, 10000);
            sheet.setColumnWidth(5, 4500);
            sheet.setColumnWidth(6, 5000);

            if (asignacionesOrdenadas.isEmpty()) {
                Row row = sheet.createRow(3);
                row.createCell(0).setCellValue("No se encontraron asignaciones para los filtros seleccionados.");
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            workbook.write(baos);
            return baos;
        }
    }

    private String resolverCodigoMateria(Asignacion asignacion) {
        if (asignacion.getMateria() != null && asignacion.getMateria().getCodigo() != null) {
            return String.valueOf(asignacion.getMateria().getCodigo());
        }

        String comision = asignacion.getComision();
        if (comision != null && comision.contains("-")) {
            return comision.substring(0, comision.indexOf('-')).trim();
        }

        return "";
    }

    private String resolverComision(Asignacion asignacion) {
        if (asignacion.getComision() != null && !asignacion.getComision().isBlank()) {
            return asignacion.getComision();
        }

        if (asignacion.getMateria() != null && asignacion.getMateria().getCodigo() != null) {
            String turnoAbreviado = abreviarTurnoExport(asignacion.getTurno());
            if (!turnoAbreviado.isEmpty()) {
                return asignacion.getMateria().getCodigo() + "-1 " + turnoAbreviado;
            }
        }

        return "";
    }

    private String abreviarTurnoExport(String turno) {
        if (turno == null) return "";

        String turnoNormalizado = Normalizer.normalize(turno, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .trim();

        if (turnoNormalizado.contains("manana") || turnoNormalizado.contains("maniana")) return "TM";
        if (turnoNormalizado.contains("tarde")) return "TT";
        if (turnoNormalizado.contains("noche")) return "TN";
        return "";
    }

    private void validarConflictosAlMoverAsignacion(Long asignacionId, Integer anioNuevo, String diaNuevo, String turnoNuevo) {
        List<AsignacionDocente> docentesDeAsignacion = asignacionDocenteRepository.findByAsignacionId(asignacionId).stream()
                .filter(ad -> Boolean.TRUE.equals(ad.getConfirmado()))
                .toList();

        if (docentesDeAsignacion.isEmpty()) {
            return;
        }

        for (AsignacionDocente docenteAsignado : docentesDeAsignacion) {
            if (docenteAsignado.getDocente() == null) {
                continue;
            }
            Long docenteId = docenteAsignado.getDocente().getId();

            for (AsignacionDocente existente : asignacionDocenteRepository.findAll()) {
                if (!Boolean.TRUE.equals(existente.getConfirmado())) {
                    continue;
                }
                if (existente.getAsignacion() == null || existente.getDocente() == null) {
                    continue;
                }
                if (Objects.equals(existente.getAsignacion().getId(), asignacionId)) {
                    continue;
                }
                if (!Objects.equals(existente.getDocente().getId(), docenteId)) {
                    continue;
                }

                Asignacion asignacionExistente = existente.getAsignacion();
                if (mismoHorario(anioNuevo, diaNuevo, turnoNuevo, asignacionExistente)) {
                    throw new ConflictoHorarioException(
                            "No se puede mover la materia: " + existente.getDocente().getNombre()
                                    + " ya tiene una materia en ese horario ("
                                    + textoHorario(asignacionExistente) + ").");
                }
            }
        }
    }

    private boolean mismoHorario(Integer anio, String dia, String turno, Asignacion asignacion) {
        return Objects.equals(anio, asignacion.getAnio())
                && normalizar(dia).equals(normalizar(asignacion.getDia()))
                && normalizar(turno).equals(normalizar(asignacion.getTurno()));
    }

    private String normalizar(String texto) {
        if (texto == null) {
            return "";
        }
        return Normalizer.normalize(texto, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .trim()
                .replace("maniana", "manana");
    }

    private String textoHorario(Asignacion asignacion) {
        String dia = asignacion.getDia() != null ? asignacion.getDia() : "dia sin definir";
        String turno = asignacion.getTurno() != null ? asignacion.getTurno() : "turno sin definir";
        return dia + " - " + turno;
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
