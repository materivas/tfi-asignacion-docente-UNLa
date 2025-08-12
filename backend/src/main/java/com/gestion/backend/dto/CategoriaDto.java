package com.gestion.backend.dto;

import com.gestion.backend.model.Categoria;

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

    public static CategoriaDto fromEntity(Categoria categoria) {
        return new CategoriaDto(
            categoria.getId(),
            categoria.getNombre(),
            categoria.getMaxMaterias()
        );
    }

    public static Categoria toEntity(CategoriaDto dto) {
        Categoria categoria = new Categoria();
        categoria.setId(dto.getId());
        categoria.setNombre(dto.getNombre());
        categoria.setMaxMaterias(dto.getMaxMaterias());
        return categoria;
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
