package com.gestion.backend.dto;

import com.gestion.backend.model.Materia;
import com.gestion.backend.model.Plan;

import jakarta.persistence.Column;

public class MateriaDto {
    private Long id;
    private String nombre;
    private Long planId;
    private Integer anio;
    private Integer codigo;

    public MateriaDto() {}

    public MateriaDto(Long id, String nombre, Long planId, Integer anio, Integer codigo) {
        this.id = id;
        this.nombre = nombre;
        this.planId = planId;
        this.anio = anio;
        this.codigo = codigo;
    }

    public static MateriaDto fromEntity(Materia materia) {
        return new MateriaDto(
            materia.getId(),
            materia.getNombre(),
            materia.getPlan() != null ? materia.getPlan().getId() : null,
            materia.getAnio(),
            materia.getCodigo()
        );
    }

    public static Materia toEntity(MateriaDto dto, Plan plan) {
        Materia materia = new Materia();
        materia.setId(dto.getId());
        materia.setNombre(dto.getNombre());
        materia.setPlan(plan);
        materia.setAnio(dto.getAnio());
        materia.setCodigo(dto.getCodigo());
        return materia;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Long getPlanId() {
        return planId;
    }

    public void setPlanId(Long planId) {
        this.planId = planId;
    }

    public Integer getAnio() {
        return anio;
    }

    public void setAnio(Integer anio) {
        this.anio = anio;
    }

    public Integer getCodigo() {
        return codigo;
    }

    public void setCodigo(Integer codigo) {
        this.codigo = codigo;
    }

}
