package com.gestion.backend.service;

import com.gestion.backend.dto.MateriaDto;
import com.gestion.backend.model.Materia;
import com.gestion.backend.model.Plan;
import com.gestion.backend.repository.MateriaRepository;
import com.gestion.backend.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MateriaService {

    @Autowired
    private MateriaRepository materiaRepository;

    @Autowired
    private PlanRepository planRepository;

    public List<MateriaDto> listarTodos() {
        return materiaRepository.findAll().stream().map(MateriaDto::fromEntity).toList();
    }

    public Optional<MateriaDto> obtenerPorId(Long id) {
        return materiaRepository.findById(id).map(MateriaDto::fromEntity);
    }

    @Transactional
    public MateriaDto crear(MateriaDto dto) {
        Plan plan = planRepository.findById(dto.getPlanId())
            .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
        var materia = MateriaDto.toEntity(dto, plan);
        return MateriaDto.fromEntity(materiaRepository.save(materia));
    }

    public MateriaDto actualizar(Long id, MateriaDto dto) {
        Plan plan = planRepository.findById(dto.getPlanId())
            .orElseThrow(() -> new RuntimeException("Plan no encontrado"));
        return materiaRepository.findById(id).map(materia -> {
            materia.setNombre(dto.getNombre());
            materia.setPlan(plan);
            materia.setAnio(dto.getAnio());
            return MateriaDto.fromEntity(materiaRepository.save(materia));
        }).orElseThrow(() -> new RuntimeException("Materia no encontrada"));
    }

    public void eliminar(Long id) {
        materiaRepository.deleteById(id);
    }
} 