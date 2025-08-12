package com.gestion.backend.service;

import com.gestion.backend.dto.AsignacionDocenteDto;
import com.gestion.backend.model.AsignacionDocente;
import com.gestion.backend.model.Asignacion;
import com.gestion.backend.model.Docente;
import com.gestion.backend.model.Rol;
import com.gestion.backend.repository.AsignacionDocenteRepository;
import com.gestion.backend.repository.AsignacionRepository;
import com.gestion.backend.repository.DocenteRepository;
import com.gestion.backend.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AsignacionDocenteService {

    @Autowired
    private AsignacionDocenteRepository asignacionDocenteRepository;

    @Autowired
    private AsignacionRepository asignacionRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private RolRepository rolRepository;

    public List<AsignacionDocenteDto> listarTodos() {
        return asignacionDocenteRepository.findAll().stream().map(AsignacionDocenteDto::fromEntity).toList();
    }

    public Optional<AsignacionDocenteDto> obtenerPorId(Long id) {
        return asignacionDocenteRepository.findById(id).map(AsignacionDocenteDto::fromEntity);
    }

    @Transactional
    public AsignacionDocenteDto crear(AsignacionDocenteDto dto) {
        Asignacion asignacion = asignacionRepository.findById(dto.getAsignacionId())
            .orElseThrow(() -> new RuntimeException("Asignacion no encontrada"));
        Docente docente = docenteRepository.findById(dto.getDocenteId())
            .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
        Rol rol = rolRepository.findById(dto.getRolId())
            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        var asignacionDocente = AsignacionDocenteDto.toEntity(dto, asignacion, docente, rol);
        return AsignacionDocenteDto.fromEntity(asignacionDocenteRepository.save(asignacionDocente));
    }

    public AsignacionDocenteDto actualizar(Long id, AsignacionDocenteDto dto) {
        Asignacion asignacion = asignacionRepository.findById(dto.getAsignacionId())
            .orElseThrow(() -> new RuntimeException("Asignacion no encontrada"));
        Docente docente = docenteRepository.findById(dto.getDocenteId())
            .orElseThrow(() -> new RuntimeException("Docente no encontrado"));
        Rol rol = rolRepository.findById(dto.getRolId())
            .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        return asignacionDocenteRepository.findById(id).map(asignacionDocente -> {
            asignacionDocente.setAsignacion(asignacion);
            asignacionDocente.setDocente(docente);
            asignacionDocente.setRol(rol);
            asignacionDocente.setHorasAsignadas(dto.getHorasAsignadas());
            asignacionDocente.setConfirmado(dto.getConfirmado());
            return AsignacionDocenteDto.fromEntity(asignacionDocenteRepository.save(asignacionDocente));
        }).orElseThrow(() -> new RuntimeException("AsignacionDocente no encontrada"));
    }

    public void eliminar(Long id) {
        asignacionDocenteRepository.deleteById(id);
    }
} 