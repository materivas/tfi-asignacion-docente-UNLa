package com.gestion.backend.service;

import com.gestion.backend.dto.AsignacionDocenteDto;
import com.gestion.backend.exception.ConflictoHorarioException;
import com.gestion.backend.exception.LimiteCargaDocenteException;
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
import java.text.Normalizer;
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

    @Autowired
    private EmailService emailService;

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
        validarConflictoHorario(null, asignacion, docente, dto.getConfirmado());
        validarLimiteCargaDocente(null, asignacion, docente, dto.getConfirmado());
        var asignacionDocente = AsignacionDocenteDto.toEntity(dto, asignacion, docente, rol);
        // --- INICIO LÓGICA DE CORREO ---
        AsignacionDocente guardado = asignacionDocenteRepository.save(asignacionDocente);
        if (Boolean.TRUE.equals(guardado.getConfirmado())) {
            emailService.enviarConfirmacionAsignacion(guardado);
        }
        return AsignacionDocenteDto.fromEntity(guardado);
        // --- FIN LÓGICA DE CORREO ---
    }

    @Transactional
    public AsignacionDocenteDto actualizar(Long id, AsignacionDocenteDto dto) {
        Asignacion asignacion = asignacionRepository.findById(dto.getAsignacionId())
                .orElseThrow(() -> new RuntimeException("Asignacion no encontrada"));
        Docente docente = docenteRepository.findById(dto.getDocenteId())
                .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
        Rol rol = rolRepository.findById(dto.getRolId())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        return asignacionDocenteRepository.findById(id).map(asignacionDocente -> {
            validarConflictoHorario(id, asignacion, docente, dto.getConfirmado());
            validarLimiteCargaDocente(id, asignacion, docente, dto.getConfirmado());
            asignacionDocente.setAsignacion(asignacion);
            asignacionDocente.setDocente(docente);
            asignacionDocente.setRol(rol);
            asignacionDocente.setHorasAsignadas(dto.getHorasAsignadas());
            asignacionDocente.setConfirmado(dto.getConfirmado());

            // --- INICIO LÓGICA DE CORREO ---
            AsignacionDocente guardado = asignacionDocenteRepository.save(asignacionDocente);
            if (Boolean.TRUE.equals(guardado.getConfirmado())) {
                emailService.enviarConfirmacionAsignacion(guardado);
            }
            return AsignacionDocenteDto.fromEntity(guardado);
            // --- FIN LÓGICA DE CORREO ---

        }).orElseThrow(() -> new RuntimeException("AsignacionDocente no encontrada"));
    }

    public void eliminar(Long id) {
        asignacionDocenteRepository.deleteById(id);
    }

    public Map<String, Object> importarAsignacionDocentesDesdeExcel(
            org.springframework.web.multipart.MultipartFile archivo) throws java.io.IOException {
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
                if (fila == null)
                    continue;
                try {
                    String asignacionIdStr = obtenerTexto(fila.getCell(0));
                    String docenteIdStr = obtenerTexto(fila.getCell(1));
                    String rolIdStr = obtenerTexto(fila.getCell(2));
                    String horasAsignadasStr = obtenerTexto(fila.getCell(3));
                    String confirmadoStr = obtenerTexto(fila.getCell(4));

                    if (asignacionIdStr.isEmpty() || docenteIdStr.isEmpty() || rolIdStr.isEmpty()
                            || horasAsignadasStr.isEmpty() || confirmadoStr.isEmpty()) {
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

                // Enviar correos de confirmación para las asignaciones confirmadas
                for (AsignacionDocente asignacionDocente : nuevasAsignacionesDocente) {
                    if (Boolean.TRUE.equals(asignacionDocente.getConfirmado())) {
                        emailService.enviarConfirmacionAsignacion(asignacionDocente);
                    }
                }
            }
        }

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("creados", creados);
        resultado.put("ignorados", ignorados);
        resultado.put("errores", errores);
        return resultado;
    }

    private String obtenerTexto(Cell cell) {
        if (cell == null)
            return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                double val = cell.getNumericCellValue();
                if (val == (long) val)
                    yield String.valueOf((long) val).trim();
                else
                    yield String.valueOf(val).trim();
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }

    private void validarConflictoHorario(Long asignacionDocenteIdActual, Asignacion asignacionNueva, Docente docente,
            Boolean confirmadoNuevo) {
        if (!Boolean.TRUE.equals(confirmadoNuevo)) {
            return;
        }

        for (AsignacionDocente existente : asignacionDocenteRepository.findAll()) {
            if (asignacionDocenteIdActual != null && asignacionDocenteIdActual.equals(existente.getId())) {
                continue;
            }
            if (!Boolean.TRUE.equals(existente.getConfirmado())) {
                continue;
            }
            if (existente.getDocente() == null || existente.getAsignacion() == null) {
                continue;
            }
            if (!docente.getId().equals(existente.getDocente().getId())) {
                continue;
            }

            Asignacion asignacionExistente = existente.getAsignacion();
            if (Objects.equals(asignacionNueva.getId(), asignacionExistente.getId())) {
                throw new ConflictoHorarioException(
                        "No se puede asignar a " + docente.getNombre() + ": ya figura en esta materia.");
            }

            if (mismoHorario(asignacionNueva, asignacionExistente)) {
                throw new ConflictoHorarioException(
                        "No se puede asignar a " + docente.getNombre()
                                + ": ya tiene una materia en ese horario ("
                                + textoHorario(asignacionExistente) + ").");
            }
        }
    }

    private void validarLimiteCargaDocente(Long asignacionDocenteIdActual, Asignacion asignacionNueva, Docente docente,
            Boolean confirmadoNuevo) {
        if (!Boolean.TRUE.equals(confirmadoNuevo)) {
            return;
        }
        if (docente.getCategoria() == null || docente.getCategoria().getMaxMaterias() == null) {
            return;
        }

        int maxMaterias = docente.getCategoria().getMaxMaterias();
        long cargaActual = asignacionDocenteRepository.findAll().stream()
                .filter(existente -> asignacionDocenteIdActual == null
                        || !asignacionDocenteIdActual.equals(existente.getId()))
                .filter(existente -> Boolean.TRUE.equals(existente.getConfirmado()))
                .filter(existente -> existente.getDocente() != null && existente.getAsignacion() != null)
                .filter(existente -> docente.getId().equals(existente.getDocente().getId()))
                .filter(existente -> Objects.equals(asignacionNueva.getAnio(), existente.getAsignacion().getAnio()))
                .count();

        if (cargaActual >= maxMaterias) {
            String anioTexto = asignacionNueva.getAnio() != null ? " en " + asignacionNueva.getAnio() : "";
            throw new LimiteCargaDocenteException(
                    "No se puede asignar a " + docente.getNombre()
                            + ": ya alcanzo el maximo de " + maxMaterias
                            + " materia(s)" + anioTexto + ".");
        }
    }

    private boolean mismoHorario(Asignacion primera, Asignacion segunda) {
        return Objects.equals(primera.getAnio(), segunda.getAnio())
                && normalizar(primera.getDia()).equals(normalizar(segunda.getDia()))
                && normalizar(primera.getTurno()).equals(normalizar(segunda.getTurno()));
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
}
