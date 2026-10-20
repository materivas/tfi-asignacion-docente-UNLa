package com.gestion.backend.service;

import com.gestion.backend.dto.AuditoriaEventoDto;
import com.gestion.backend.dto.AuditoriaPaginaDto;
import com.gestion.backend.model.Asignacion;
import com.gestion.backend.model.AsignacionDocente;
import com.gestion.backend.model.AuditRevision;
import com.gestion.backend.model.Docente;
import com.gestion.backend.model.Materia;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.hibernate.envers.query.AuditQuery;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AuditoriaService {

    private static final Map<String, Class<?>> ENTIDADES = Map.of(
            "ASIGNACION", Asignacion.class,
            "ASIGNACION_DOCENTE", AsignacionDocente.class,
            "DOCENTE", Docente.class,
            "MATERIA", Materia.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public AuditoriaPaginaDto buscarHistorial(int pagina, int tamanio, String entidad, String autor) {
        int paginaSegura = Math.max(0, pagina);
        int tamanioSeguro = Math.min(Math.max(1, tamanio), 100);
        String entidadFiltro = entidad == null || entidad.isBlank() ? null : entidad.trim().toUpperCase();
        if (entidadFiltro != null && !ENTIDADES.containsKey(entidadFiltro)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipo de entidad inválido");
        }
        String autorFiltro = autor == null || autor.isBlank() ? null : autor.trim();
        int resultadosNecesarios = Math.addExact(Math.multiplyExact(paginaSegura + 1, tamanioSeguro), 1);

        AuditReader reader = AuditReaderFactory.get(entityManager);
        List<AuditoriaEventoDto> eventos = new ArrayList<>();
        ENTIDADES.forEach((nombre, clase) -> {
            if (entidadFiltro == null || entidadFiltro.equals(nombre)) {
                eventos.addAll(cargarEventos(reader, clase, nombre, autorFiltro, resultadosNecesarios));
            }
        });

        eventos.sort(Comparator.comparing(AuditoriaEventoDto::revision).reversed()
                .thenComparing(AuditoriaEventoDto::entidad));
        int inicio = Math.min(paginaSegura * tamanioSeguro, eventos.size());
        int fin = Math.min(inicio + tamanioSeguro, eventos.size());
        return new AuditoriaPaginaDto(
                eventos.subList(inicio, fin),
                paginaSegura,
                tamanioSeguro,
                eventos.size() > fin);
    }

    private List<AuditoriaEventoDto> cargarEventos(
            AuditReader reader, Class<?> clase, String nombre, String autor, int limite) {
        AuditQuery consulta = reader.createQuery()
                .forRevisionsOfEntity(clase, false, true)
                .addOrder(AuditEntity.revisionNumber().desc())
                .addOrder(AuditEntity.id().desc());
        if (autor != null) {
            consulta.add(AuditEntity.revisionProperty("modifiedBy").ilike("%" + autor + "%"));
        }
        consulta.setMaxResults(limite);

        List<AuditoriaEventoDto> eventos = new ArrayList<>();
        for (Object[] revision : (List<Object[]>) consulta.getResultList()) {
            Object entidad = revision[0];
            AuditRevision metadata = (AuditRevision) revision[1];
            RevisionType tipo = (RevisionType) revision[2];
            Map<String, Object> estado = obtenerEstado(reader, nombre, entidad, metadata.getId(), tipo);
            eventos.add(new AuditoriaEventoDto(
                    metadata.getId(),
                    Instant.ofEpochMilli(metadata.getTimestamp()),
                    metadata.getModifiedBy(),
                    nombre,
                    (Long) estado.get("id"),
                    tipo.name(),
                    estado));
        }
        return eventos;
    }

    private Map<String, Object> obtenerEstado(
            AuditReader reader, String nombre, Object entidad, Number revision, RevisionType tipo) {
        Map<String, Object> estado = new LinkedHashMap<>();
        switch (nombre) {
            case "ASIGNACION" -> {
                Asignacion asignacion = (Asignacion) entidad;
                if (tipo == RevisionType.DEL) {
                    Asignacion anterior = obtenerVersionAnterior(reader, Asignacion.class, asignacion.getId(), revision);
                    if (anterior != null) asignacion = anterior;
                }
                estado.put("id", asignacion.getId());
                Long materiaId = asignacion.getMateria() != null ? asignacion.getMateria().getId() : null;
                estado.put("materia", obtenerNombreMateria(reader, materiaId, revision));
                estado.put("cuatrimestreId", asignacion.getCuatrimestre() != null ? asignacion.getCuatrimestre().getId() : null);
                estado.put("turno", asignacion.getTurno());
                estado.put("anio", asignacion.getAnio());
                estado.put("dia", asignacion.getDia());
                estado.put("comision", asignacion.getComision());
            }
            case "ASIGNACION_DOCENTE" -> {
                AsignacionDocente asignacionDocente = (AsignacionDocente) entidad;
                if (tipo == RevisionType.DEL) {
                    AsignacionDocente anterior = obtenerVersionAnterior(
                            reader, AsignacionDocente.class, asignacionDocente.getId(), revision);
                    if (anterior != null) asignacionDocente = anterior;
                }
                estado.put("id", asignacionDocente.getId());
                Long asignacionId = asignacionDocente.getAsignacion() != null
                        ? asignacionDocente.getAsignacion().getId() : null;
                Asignacion asignacion = asignacionId != null
                        ? reader.find(Asignacion.class, asignacionId, revision) : null;
                if (asignacion == null && asignacionId != null) {
                    asignacion = obtenerVersionAnterior(reader, Asignacion.class, asignacionId, revision);
                }
                if (asignacion == null && asignacionId != null) {
                    asignacion = entityManager.find(Asignacion.class, asignacionId);
                }
                Long materiaId = asignacion != null && asignacion.getMateria() != null
                        ? asignacion.getMateria().getId() : null;
                estado.put("materia", obtenerNombreMateria(reader, materiaId, revision));
                Long docenteId = asignacionDocente.getDocente() != null
                        ? asignacionDocente.getDocente().getId() : null;
                Docente docente = docenteId != null ? reader.find(Docente.class, docenteId, revision) : null;
                if (docente == null && docenteId != null) {
                    docente = entityManager.find(Docente.class, docenteId);
                }
                estado.put("docente", docente != null
                        ? docente.getId() + " - " + docente.getNombre()
                        : docenteId != null ? "Docente #" + docenteId : "Sin docente asociado");
                estado.put("rol", asignacionDocente.getRol() != null ? asignacionDocente.getRol().getNombre() : null);
                estado.put("horasAsignadas", asignacionDocente.getHorasAsignadas());
                estado.put("confirmado", asignacionDocente.getConfirmado());
            }
            case "DOCENTE" -> {
                Docente docente = (Docente) entidad;
                estado.put("id", docente.getId());
                estado.put("nombre", docente.getNombre());
                estado.put("dni", docente.getDni());
                estado.put("email", docente.getEmail());
                estado.put("categoriaId", docente.getCategoria() != null ? docente.getCategoria().getId() : null);
                estado.put("dedicacion", docente.getDedicacion());
                estado.put("concursado", docente.getConcursado());
            }
            case "MATERIA" -> {
                Materia materia = (Materia) entidad;
                estado.put("id", materia.getId());
                estado.put("nombre", materia.getNombre());
                estado.put("planId", materia.getPlan() != null ? materia.getPlan().getId() : null);
                estado.put("anio", materia.getAnio());
                estado.put("codigo", materia.getCodigo());
            }
            default -> throw new IllegalArgumentException("Entidad no soportada: " + nombre);
        }
        return estado;
    }

    private String obtenerNombreMateria(AuditReader reader, Long materiaId, Number revision) {
        if (materiaId == null) return "Sin materia asociada";
        boolean eliminada = estaEliminadaEnRevision(reader, Materia.class, materiaId, revision);
        Materia materia = reader.find(Materia.class, materiaId, revision);
        if (eliminada) {
            Materia anterior = obtenerVersionAnterior(reader, Materia.class, materiaId, revision);
            if (anterior != null) materia = anterior;
        }

        if (materia == null) materia = entityManager.find(Materia.class, materiaId);
        String nombre = materia != null ? materia.getNombre() : "Materia";
        return materiaId + " - " + nombre + (eliminada ? " (eliminada)" : "");
    }

    private boolean estaEliminadaEnRevision(AuditReader reader, Class<?> clase, Long id, Number revision) {
        List<Number> revisiones = reader.getRevisions(clase, id);
        Number ultimaRevision = revisiones.stream()
                .filter(numero -> numero.longValue() <= revision.longValue())
                .max(Comparator.comparingLong(Number::longValue))
                .orElse(null);
        if (ultimaRevision != null) {
            Object[] ultima = (Object[]) reader.createQuery()
                    .forRevisionsOfEntity(clase, false, true)
                    .add(AuditEntity.id().eq(id))
                    .add(AuditEntity.revisionNumber().eq(ultimaRevision))
                    .getSingleResult();
            return ultima[2] == RevisionType.DEL;
        }
        return entityManager.find(clase, id) == null;
    }

    private <T> T obtenerVersionAnterior(AuditReader reader, Class<T> clase, Long id, Number revision) {
        if (id == null) return null;
        List<Number> revisiones = reader.getRevisions(clase, id);
        Number revisionAnterior = revisiones.stream()
                .filter(numero -> numero.longValue() < revision.longValue())
                .max(Comparator.comparingLong(Number::longValue))
                .orElse(null);
        return revisionAnterior == null ? null : reader.find(clase, id, revisionAnterior);
    }
}
