package com.gestion.backend.service;

import com.gestion.backend.dto.HistorialAsignacionDto;
import com.gestion.backend.dto.HistorialAsignacionPaginaDto;
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
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class HistorialAsignacionService {

    @PersistenceContext
    private EntityManager entityManager;

    private final AsignacionRepository asignacionRepository;

    public HistorialAsignacionService(AsignacionRepository asignacionRepository) {
        this.asignacionRepository = asignacionRepository;
    }

    @Transactional(readOnly = true)
    public HistorialAsignacionPaginaDto obtenerHistorial(Long asignacionId, int pagina, int tamanio) {
        int paginaSegura = Math.max(0, pagina);
        int tamanioSeguro = Math.min(Math.max(1, tamanio), 100);
        int limite = Math.addExact(Math.multiplyExact(paginaSegura + 1, tamanioSeguro), 1);
        AuditReader reader = AuditReaderFactory.get(entityManager);
        List<HistorialAsignacionDto> historial = new ArrayList<>();

        List<Object[]> revisionesAsignacion = reader.createQuery()
                .forRevisionsOfEntity(Asignacion.class, false, true)
                .add(AuditEntity.id().eq(asignacionId))
                .addOrder(AuditEntity.revisionNumber().desc())
                .setMaxResults(limite)
                .getResultList();
        for (Object[] revision : revisionesAsignacion) {
            Asignacion asignacion = (Asignacion) revision[0];
            AuditRevision metadata = (AuditRevision) revision[1];
            RevisionType tipo = (RevisionType) revision[2];
            historial.add(new HistorialAsignacionDto(
                    metadata.getId(), Instant.ofEpochMilli(metadata.getTimestamp()), metadata.getModifiedBy(),
                    "ASIGNACION", tipo.name(), estadoAsignacion(asignacion)));
        }

        List<Object[]> revisionesDocentes = reader.createQuery()
                .forRevisionsOfEntity(AsignacionDocente.class, false, true)
                .add(AuditEntity.relatedId("asignacion").eq(asignacionId))
                .addOrder(AuditEntity.revisionNumber().desc())
                .setMaxResults(limite)
                .getResultList();
        for (Object[] revision : revisionesDocentes) {
            AsignacionDocente asignacionDocente = (AsignacionDocente) revision[0];
            AuditRevision metadata = (AuditRevision) revision[1];
            RevisionType tipo = (RevisionType) revision[2];
            historial.add(new HistorialAsignacionDto(
                    metadata.getId(), Instant.ofEpochMilli(metadata.getTimestamp()), metadata.getModifiedBy(),
                    "ASIGNACION_DOCENTE", tipo.name(), estadoAsignacionDocente(asignacionDocente)));
        }

        if (historial.isEmpty() && !asignacionRepository.existsById(asignacionId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Asignación no encontrada");
        }

        historial.sort(Comparator.comparing(HistorialAsignacionDto::fecha).reversed()
                .thenComparing(HistorialAsignacionDto::revision, Comparator.reverseOrder())
                .thenComparing(HistorialAsignacionDto::entidad));
        int inicio = Math.min(paginaSegura * tamanioSeguro, historial.size());
        int fin = Math.min(inicio + tamanioSeguro, historial.size());
        return new HistorialAsignacionPaginaDto(
                historial.subList(inicio, fin), paginaSegura, tamanioSeguro, historial.size() > fin);
    }

    private Map<String, Object> estadoAsignacion(Asignacion asignacion) {
        Map<String, Object> estado = new LinkedHashMap<>();
        estado.put("id", asignacion.getId());
        Long materiaId = asignacion.getMateria() != null ? asignacion.getMateria().getId() : null;
        Materia materia = materiaId != null ? entityManager.find(Materia.class, materiaId) : null;
        estado.put("materia", materia != null ? materiaId + " - " + materia.getNombre()
                : materiaId != null ? "Materia #" + materiaId : "Sin materia asociada");
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
        Long docenteId = asignacionDocente.getDocente() != null ? asignacionDocente.getDocente().getId() : null;
        Docente docente = docenteId != null ? entityManager.find(Docente.class, docenteId) : null;
        estado.put("docente", docente != null ? docenteId + " - " + docente.getNombre()
                : docenteId != null ? "Docente #" + docenteId : "Sin docente asociado");
        estado.put("rol", asignacionDocente.getRol() != null ? asignacionDocente.getRol().getNombre() : null);
        estado.put("horasAsignadas", asignacionDocente.getHorasAsignadas());
        estado.put("confirmado", asignacionDocente.getConfirmado());
        return estado;
    }
}
