package com.gestion.backend.service;

import com.gestion.backend.dto.PlanDto;
import com.gestion.backend.model.Plan;
import com.gestion.backend.repository.PlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlanService {

    @Autowired
    private PlanRepository planRepository;

    public List<PlanDto> listarTodos() {
        return planRepository.findAll().stream().map(PlanDto::fromEntity).toList();
    }

    public Optional<PlanDto> obtenerPorId(Long id) {
        return planRepository.findById(id).map(PlanDto::fromEntity);
    }

    public PlanDto crear(PlanDto dto) {
        var plan = PlanDto.toEntity(dto);
        return PlanDto.fromEntity(planRepository.save(plan));
    }

    public PlanDto actualizar(Long id, PlanDto dto) {
        return planRepository.findById(id).map(plan -> {
            plan.setNombre(dto.getNombre());
            plan.setDescripcion(dto.getDescripcion());
            return PlanDto.fromEntity(planRepository.save(plan));
        }).orElseThrow(() -> new RuntimeException("Plan no encontrado"));
    }

    public void eliminar(Long id) {
        planRepository.deleteById(id);
    }
} 