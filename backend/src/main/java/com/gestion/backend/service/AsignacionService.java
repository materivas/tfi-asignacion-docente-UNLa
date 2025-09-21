package com.gestion.backend.service;

import com.gestion.backend.dto.AsignacionDto;
import com.gestion.backend.model.Asignacion;
import com.gestion.backend.model.Materia;
import com.gestion.backend.model.Cuatrimestre;
import com.gestion.backend.repository.AsignacionRepository;
import com.gestion.backend.repository.MateriaRepository;
import com.gestion.backend.repository.CuatrimestreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AsignacionService {

    @Autowired
    private AsignacionRepository asignacionRepository;

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private CuatrimestreRepository cuatrimestreRepository;

    public List<AsignacionDto> listarTodos() {
        return asignacionRepository.findAll().stream().map(AsignacionDto::fromEntity).toList();
    }

    public Optional<AsignacionDto> obtenerPorId(Long id) {
        return asignacionRepository.findById(id).map(AsignacionDto::fromEntity);
    }

    @Transactional
    public AsignacionDto crear(AsignacionDto dto) {
        Materia materia = materiaRepository.findById(dto.getMateriaId())
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        Cuatrimestre cuatrimestre = cuatrimestreRepository.findById(dto.getCuatrimestreId())
            .orElseThrow(() -> new RuntimeException("Cuatrimestre no encontrada"));

        var asignacion = AsignacionDto.toEntity(dto, materia, cuatrimestre);
        asignacion.setId(null); 

        return AsignacionDto.fromEntity(asignacionRepository.save(asignacion));
    }

    public AsignacionDto actualizar(Long id, AsignacionDto dto) {
        Materia materia = materiaRepository.findById(dto.getMateriaId())
            .orElseThrow(() -> new RuntimeException("Materia no encontrada"));
        Cuatrimestre cuatrimestre = cuatrimestreRepository.findById(dto.getCuatrimestreId())
            .orElseThrow(() -> new RuntimeException("Cuatrimestre no encontrado"));
        return asignacionRepository.findById(id).map(asignacion -> {
            asignacion.setMateria(materia);
            asignacion.setCuatrimestre(cuatrimestre);
            asignacion.setTurno(dto.getTurno());
            asignacion.setAnio(dto.getAnio());
            asignacion.setDia(dto.getDia());
            return AsignacionDto.fromEntity(asignacionRepository.save(asignacion));
        }).orElseThrow(() -> new RuntimeException("Asignacion no encontrada"));
    }

    public void eliminar(Long id) {
        asignacionRepository.deleteById(id);
    }
} 