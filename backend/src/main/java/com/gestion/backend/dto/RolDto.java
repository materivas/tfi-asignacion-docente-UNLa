package com.gestion.backend.dto;

import com.gestion.backend.model.Rol;

public class RolDto {
    private Long id;
    private String nombre;

    public RolDto() {}

    public RolDto(Long id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }

    public static RolDto fromEntity(Rol rol) {
        return new RolDto(
            rol.getId(),
            rol.getNombre()
        );
    }

    public static Rol toEntity(RolDto dto) {
        Rol rol = new Rol();
        rol.setId(dto.getId());
        rol.setNombre(dto.getNombre());
        return rol;
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
} 