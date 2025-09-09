package com.gestion.backend.dto;

import com.gestion.backend.model.Asignacion;
import com.gestion.backend.model.Materia;
import com.gestion.backend.model.Cuatrimestre;

public class AsignacionDto {
    private Long id;
    private Long materiaId;
    private Long cuatrimestreId;

    public AsignacionDto() {}

    public AsignacionDto(Long id, Long materiaId, Long cuatrimestreId) {
        this.id = id;
        this.materiaId = materiaId;
        this.cuatrimestreId = cuatrimestreId;
    }

    public static AsignacionDto fromEntity(Asignacion asignacion) {
        return new AsignacionDto(
            asignacion.getId(),
            asignacion.getMateria() != null ? asignacion.getMateria().getId() : null,
            asignacion.getCuatrimestre() != null ? asignacion.getCuatrimestre().getId() : null
        );
    }

    public static Asignacion toEntity(AsignacionDto dto, Materia materia, Cuatrimestre cuatrimestre) {
        Asignacion asignacion = new Asignacion();
        asignacion.setId(dto.getId());
        asignacion.setMateria(materia);
        asignacion.setCuatrimestre(cuatrimestre);
        return asignacion;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getMateriaId() {
        return materiaId;
    }

    public void setMateriaId(Long materiaId) {
        this.materiaId = materiaId;
    }

    public Long getCuatrimestreId() {
        return cuatrimestreId;
    }

    public void setCuatrimestreId(Long cuatrimestreId) {
        this.cuatrimestreId = cuatrimestreId;
    }
} 