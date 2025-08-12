package com.gestion.backend.dto;

import com.gestion.backend.model.Plan;

public class PlanDto {
    private Long id;
    private String nombre;
    private String descripcion;

    public PlanDto() {}

    public PlanDto(Long id, String nombre, String descripcion) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public static PlanDto fromEntity(Plan plan) {
        return new PlanDto(
            plan.getId(),
            plan.getNombre(),
            plan.getDescripcion()
        );
    }

    public static Plan toEntity(PlanDto dto) {
        Plan plan = new Plan();
        plan.setId(dto.getId());
        plan.setNombre(dto.getNombre());
        plan.setDescripcion(dto.getDescripcion());
        return plan;
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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
} 