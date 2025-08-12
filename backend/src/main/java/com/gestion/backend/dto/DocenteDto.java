package com.gestion.backend.dto;

import com.gestion.backend.model.Docente;
import com.gestion.backend.model.Categoria;

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

    public static DocenteDto fromEntity(Docente docente) {
        return new DocenteDto(
            docente.getId(),
            docente.getNombre(),
            docente.getDni(),
            docente.getCategoria() != null ? docente.getCategoria().getId() : null
        );
    }

    public static Docente toEntity(DocenteDto dto, Categoria categoria) {
        Docente docente = new Docente();
        docente.setId(dto.getId());
        docente.setNombre(dto.getNombre());
        docente.setDni(dto.getDni());
        docente.setCategoria(categoria);
        return docente;
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
