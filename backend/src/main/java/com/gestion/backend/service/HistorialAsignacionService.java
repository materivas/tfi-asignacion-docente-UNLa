package com.gestion.backend.service;

import com.gestion.backend.dto.HistorialAsignacionDto;
import com.gestion.backend.model.Asignacion;
import com.gestion.backend.model.AsignacionDocente;
import com.gestion.backend.model.AuditRevision;
import com.gestion.backend.model.Docente;
import com.gestion.backend.model.Materia;
import com.gestion.backend.repository.AsignacionRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class HistorialAsignacionService {

    @PersistenceContext
    private EntityManager entityManager;

    private final AsignacionRepository asignacionRepository;

    public HistorialAsignacionService(AsignacionRepository asignacionRepository) {
        this.asignacionRepository = asignacionRepository;
    }

    @Transactional(readOnly = true)
    public List<HistorialAsignacionDto> obtenerHistorial(Long asignacionId) {
        AuditReader reader = AuditReaderFactory.get(entityManager);
        List<HistorialAsignacionDto> historial = new ArrayList<>();
        Set<Long> materiaIds = new LinkedHashSet<>();
        Set<Long> docenteIds = new LinkedHashSet<>();

        List<Object[]> revisionesAsignacion = reader.createQuery()
                .forRevisionsOfEntity(Asignacion.class, false, true)
                .add(AuditEntity.id().eq(asignacionId))
                .getResultList();

        for (Object[] revision : revisionesAsignacion) {
            Asignacion asignacion = (Asignacion) revision[0];
            AuditRevision metadata = (AuditRevision) revision[1];
            RevisionType tipo = (RevisionType) revision[2];
            if (asignacion.getMateria() != null) {
                materiaIds.add(asignacion.getMateria().getId());
            }
            historial.add(new HistorialAsignacionDto(
                    metadata.getId(),
                    Instant.ofEpochMilli(metadata.getTimestamp()),
                    metadata.getModifiedBy(),
                    "ASIGNACION",
                    tipo.name(),
                    estadoAsignacion(asignacion)));
        }

        List<Object[]> revisionesDocentes = reader.createQuery()
                .forRevisionsOfEntity(AsignacionDocente.class, false, true)
                .add(AuditEntity.relatedId("asignacion").eq(asignacionId))
                .getResultList();

        for (Object[] revision : revisionesDocentes) {
            AsignacionDocente asignacionDocente = (AsignacionDocente) revision[0];
            AuditRevision metadata = (AuditRevision) revision[1];
            RevisionType tipo = (RevisionType) revision[2];
            if (asignacionDocente.getDocente() != null) {
                docenteIds.add(asignacionDocente.getDocente().getId());
            }
            historial.add(new HistorialAsignacionDto(
                    metadata.getId(),
                    Instant.ofEpochMilli(metadata.getTimestamp()),
                    metadata.getModifiedBy(),
                    "ASIGNACION_DOCENTE",
                    tipo.name(),
                    estadoAsignacionDocente(asignacionDocente)));
        }

        for (Long materiaId : materiaIds) {
            List<Object[]> revisionesMateria = reader.createQuery()
                    .forRevisionsOfEntity(Materia.class, false, true)
                    .add(AuditEntity.id().eq(materiaId))
                    .getResultList();
            for (Object[] revision : revisionesMateria) {
                Materia materia = (Materia) revision[0];
                AuditRevision metadata = (AuditRevision) revision[1];
                RevisionType tipo = (RevisionType) revision[2];
                historial.add(new HistorialAsignacionDto(
                        metadata.getId(),
                        Instant.ofEpochMilli(metadata.getTimestamp()),
                        metadata.getModifiedBy(),
                        "MATERIA",
                        tipo.name(),
                        estadoMateria(materia)));
            }
        }

        for (Long docenteId : docenteIds) {
            List<Object[]> revisionesDocente = reader.createQuery()
                    .forRevisionsOfEntity(Docente.class, false, true)
                    .add(AuditEntity.id().eq(docenteId))
                    .getResultList();
            for (Object[] revision : revisionesDocente) {
                Docente docente = (Docente) revision[0];
                AuditRevision metadata = (AuditRevision) revision[1];
                RevisionType tipo = (RevisionType) revision[2];
                historial.add(new HistorialAsignacionDto(
                        metadata.getId(),
                        Instant.ofEpochMilli(metadata.getTimestamp()),
                        metadata.getModifiedBy(),
                        "DOCENTE",
                        tipo.name(),
                        estadoDocente(docente)));
            }
        }

        if (historial.isEmpty() && !asignacionRepository.existsById(asignacionId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Asignación no encontrada");
        }

        historial.sort((primera, segunda) -> {
            int comparacionFecha = segunda.fecha().compareTo(primera.fecha());
            return comparacionFecha != 0 ? comparacionFecha : segunda.revision().compareTo(primera.revision());
        });
        return historial;
    }

    private Map<String, Object> estadoAsignacion(Asignacion asignacion) {
        Map<String, Object> estado = new LinkedHashMap<>();
        estado.put("id", asignacion.getId());
        estado.put("materiaId", asignacion.getMateria() != null ? asignacion.getMateria().getId() : null);
        estado.put("cuatrimestreId", asignacion.getCuatrimestre() != null ? asignacion.getCuatrimestre().getId() : null);
        estado.put("turno", asignacion.getTurno());
        estado.put("anio", asignacion.getAnio());
        estado.put("dia", asignacion.getDia());
        estado.put("comision", asignacion.getComision());
        return estado;
    }

    private Map<String, Object> estadoAsignacionDocente(AsignacionDocente asignacionDocente) {
        Map<String, Object> estado = new LinkedHashMap<>();
        estado.put("id", asignacionDocente.getId());
        estado.put("docenteId", asignacionDocente.getDocente() != null ? asignacionDocente.getDocente().getId() : null);
        estado.put("rolId", asignacionDocente.getRol() != null ? asignacionDocente.getRol().getId() : null);
        estado.put("horasAsignadas", asignacionDocente.getHorasAsignadas());
        estado.put("confirmado", asignacionDocente.getConfirmado());
        return estado;
    }

    private Map<String, Object> estadoMateria(Materia materia) {
        Map<String, Object> estado = new LinkedHashMap<>();
        estado.put("id", materia.getId());
        estado.put("nombre", materia.getNombre());
        estado.put("planId", materia.getPlan() != null ? materia.getPlan().getId() : null);
        estado.put("anio", materia.getAnio());
        estado.put("codigo", materia.getCodigo());
        return estado;
    }

    private Map<String, Object> estadoDocente(Docente docente) {
        Map<String, Object> estado = new LinkedHashMap<>();
        estado.put("id", docente.getId());
        estado.put("nombre", docente.getNombre());
        estado.put("dni", docente.getDni());
        estado.put("email", docente.getEmail());
        estado.put("categoriaId", docente.getCategoria() != null ? docente.getCategoria().getId() : null);
        estado.put("dedicacion", docente.getDedicacion());
        estado.put("concursado", docente.getConcursado());
        return estado;
    }
}
