package com.gestion.backend.dto;

import com.gestion.backend.model.Asignacion;
import com.gestion.backend.model.Materia;
import com.gestion.backend.model.Cuatrimestre;

public class AsignacionDto {
    private Long id;
    private Long materiaId;
    private Long cuatrimestreId;
    private String turno;
    private Integer anio;
    private String dia;
    private String comision;

    public AsignacionDto() {}

    public AsignacionDto(Long id, Long materiaId, Long cuatrimestreId, String turno, Integer anio, String dia, String comision) {
        this.id = id;
        this.materiaId = materiaId;
        this.cuatrimestreId = cuatrimestreId;
        this.turno = turno;
        this.anio = anio;
        this.dia = dia;
        this.comision = comision;
    }

    public static AsignacionDto fromEntity(Asignacion asignacion) {
        return new AsignacionDto(
            asignacion.getId(),
            asignacion.getMateria() != null ? asignacion.getMateria().getId() : null,
            asignacion.getCuatrimestre() != null ? asignacion.getCuatrimestre().getId() : null,
            asignacion.getTurno(),
            asignacion.getAnio(),
            asignacion.getDia(),
            asignacion.getComision()
        );
    }

    public static Asignacion toEntity(AsignacionDto dto, Materia materia, Cuatrimestre cuatrimestre) {
        Asignacion asignacion = new Asignacion();
        if (dto.getId() != null) {
            asignacion.setId(dto.getId());
        }

        asignacion.setMateria(materia);
        asignacion.setCuatrimestre(cuatrimestre);
        asignacion.setTurno(dto.getTurno());
        asignacion.setAnio(dto.getAnio());
        asignacion.setDia(dto.getDia());
        asignacion.generarComision();
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

	public String getTurno() {
		return turno;
	}

	public void setTurno(String turno) {
		this.turno = turno;
	}
	public Integer getAnio() {
		return this.anio;
	}

	public void setAnio(Integer anio) {
		this.anio = anio;
	}
	public String getDia() {
		return this.dia;
	}

	public void setDia(String dia) {
		this.dia = dia;
	}

	public String getComision() {
		return this.comision;
	}

	public void setComision(String comision) {
		this.comision = comision;
	}
}