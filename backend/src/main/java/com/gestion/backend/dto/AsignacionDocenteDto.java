package com.gestion.backend.dto;

import com.gestion.backend.model.AsignacionDocente;
import com.gestion.backend.model.Asignacion;
import com.gestion.backend.model.Docente;
import com.gestion.backend.model.Rol;

public class AsignacionDocenteDto {
    private Long id;
    private Long asignacionId;
    private Long docenteId;
    private Long rolId;
    private Integer horasAsignadas;
    private Boolean confirmado;

    public AsignacionDocenteDto() {}

    public AsignacionDocenteDto(Long id, Long asignacionId, Long docenteId, Long rolId, Integer horasAsignadas, Boolean confirmado) {
        this.id = id;
        this.asignacionId = asignacionId;
        this.docenteId = docenteId;
        this.rolId = rolId;
        this.horasAsignadas = horasAsignadas;
        this.confirmado = confirmado;
    }

    public static AsignacionDocenteDto fromEntity(AsignacionDocente asignacionDocente) {
        return new AsignacionDocenteDto(
            asignacionDocente.getId(),
            asignacionDocente.getAsignacion() != null ? asignacionDocente.getAsignacion().getId() : null,
            asignacionDocente.getDocente() != null ? asignacionDocente.getDocente().getId() : null,
            asignacionDocente.getRol() != null ? asignacionDocente.getRol().getId() : null,
            asignacionDocente.getHorasAsignadas(),
            asignacionDocente.getConfirmado()
        );
    }

    public static AsignacionDocente toEntity(AsignacionDocenteDto dto, Asignacion asignacion, Docente docente, Rol rol) {
        AsignacionDocente asignacionDocente = new AsignacionDocente();
        asignacionDocente.setId(dto.getId());
        asignacionDocente.setAsignacion(asignacion);
        asignacionDocente.setDocente(docente);
        asignacionDocente.setRol(rol);
        asignacionDocente.setHorasAsignadas(dto.getHorasAsignadas());
        asignacionDocente.setConfirmado(dto.getConfirmado());
        return asignacionDocente;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAsignacionId() {
        return asignacionId;
    }

    public void setAsignacionId(Long asignacionId) {
        this.asignacionId = asignacionId;
    }

    public Long getDocenteId() {
        return docenteId;
    }

    public void setDocenteId(Long docenteId) {
        this.docenteId = docenteId;
    }

    public Long getRolId() {
        return rolId;
    }

    public void setRolId(Long rolId) {
        this.rolId = rolId;
    }

    public Integer getHorasAsignadas() {
        return horasAsignadas;
    }

    public void setHorasAsignadas(Integer horasAsignadas) {
        this.horasAsignadas = horasAsignadas;
    }

    public Boolean getConfirmado() {
        return confirmado;
    }

    public void setConfirmado(Boolean confirmado) {
        this.confirmado = confirmado;
    }
} 