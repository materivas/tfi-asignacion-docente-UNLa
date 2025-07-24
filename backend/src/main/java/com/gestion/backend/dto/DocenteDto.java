package com.gestion.backend.dto;

public class DocenteDto {
    private Long id;
    private String nombre;
    private String dni;
    private Long categoriaId;

    public DocenteDto() {}

    public DocenteDto(Long id, String nombre, String dni, Long categoriaId) {
        this.id = id;
        this.nombre = nombre;
        this.dni = dni;
        this.categoriaId = categoriaId;
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

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }
}
