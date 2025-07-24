package com.gestion.backend.dto;

public class CategoriaDto {
    private Long id;
    private String nombre;
    private Integer maxMaterias;

    public CategoriaDto() {}

    public CategoriaDto(Long id, String nombre, Integer maxMaterias) {
        this.id = id;
        this.nombre = nombre;
        this.maxMaterias = maxMaterias;
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

    public Integer getMaxMaterias() {
        return maxMaterias;
    }

    public void setMaxMaterias(Integer maxMaterias) {
        this.maxMaterias = maxMaterias;
    }
}
