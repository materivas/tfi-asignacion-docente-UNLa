package com.gestion.backend.dto;

import com.gestion.backend.model.Cuatrimestre;

public class CuatrimestreDto {
    private Long id;
    private Integer numeroCuatri;

    public CuatrimestreDto() {}

    public CuatrimestreDto(Long id, Integer numeroCuatri) {
        this.id = id;
        this.numeroCuatri = numeroCuatri;
    }

    public static CuatrimestreDto fromEntity(Cuatrimestre cuatrimestre) {
        return new CuatrimestreDto(
            cuatrimestre.getId(),
            cuatrimestre.getNumeroCuatri()
        );
    }

    public static Cuatrimestre toEntity(CuatrimestreDto dto) {
        Cuatrimestre cuatrimestre = new Cuatrimestre();
        cuatrimestre.setId(dto.getId());
        cuatrimestre.setNumeroCuatri(dto.getNumeroCuatri());
        return cuatrimestre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumeroCuatri() {
        return numeroCuatri;
    }

    public void setNumeroCuatri(Integer numeroCuatri) {
        this.numeroCuatri = numeroCuatri;
    }
} 