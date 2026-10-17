package com.gestion.backend.dto;

import com.gestion.backend.model.Docente;
import com.gestion.backend.model.Categoria;
import com.gestion.backend.model.Dedicacion;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class DocenteDto {
    private Long id;
    private String nombre;
    private String dni;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email no tiene un formato válido")
    private String email;

    private Long categoriaId;
    private Dedicacion dedicacion;
    private Boolean concursado;

    public DocenteDto() {
    }

    public DocenteDto(Long id, String nombre, String dni, String email, Long categoriaId, Dedicacion dedicacion, Boolean concursado) {
        this.id = id;
        this.nombre = nombre;
        this.dni = dni;
        this.email = email;
        this.categoriaId = categoriaId;
        this.dedicacion = dedicacion;
        this.concursado = concursado;
    }

    public static DocenteDto fromEntity(Docente docente) {
        return new DocenteDto(
                docente.getId(),
                docente.getNombre(),
                docente.getDni(),
                docente.getEmail(),
                docente.getCategoria() != null ? docente.getCategoria().getId() : null,
                docente.getDedicacion(),
                docente.getConcursado()
        );
    }

    public static Docente toEntity(DocenteDto dto, Categoria categoria) {
        Docente docente = new Docente();
        docente.setId(dto.getId());
        docente.setNombre(dto.getNombre());
        docente.setDni(dto.getDni());
        docente.setEmail(dto.getEmail());
        docente.setCategoria(categoria);
        docente.setDedicacion(dto.getDedicacion());
        docente.setConcursado(dto.getConcursado() != null ? dto.getConcursado() : false);
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Long categoriaId) {
        this.categoriaId = categoriaId;
    }

    public Dedicacion getDedicacion() {
        return dedicacion;
    }

    public void setDedicacion(Dedicacion dedicacion) {
        this.dedicacion = dedicacion;
    }

    public Boolean getConcursado() {
        return concursado;
    }

    public void setConcursado(Boolean concursado) {
        this.concursado = concursado;
    }
}