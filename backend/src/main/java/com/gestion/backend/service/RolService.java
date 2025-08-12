package com.gestion.backend.service;

import com.gestion.backend.dto.RolDto;
import com.gestion.backend.model.Rol;
import com.gestion.backend.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RolService {

    @Autowired
    private RolRepository rolRepository;

    public List<RolDto> listarTodos() {
        return rolRepository.findAll().stream().map(RolDto::fromEntity).toList();
    }

    public Optional<RolDto> obtenerPorId(Long id) {
        return rolRepository.findById(id).map(RolDto::fromEntity);
    }

    public RolDto crear(RolDto dto) {
        var rol = RolDto.toEntity(dto);
        return RolDto.fromEntity(rolRepository.save(rol));
    }

    public RolDto actualizar(Long id, RolDto dto) {
        return rolRepository.findById(id).map(rol -> {
            rol.setNombre(dto.getNombre());
            return RolDto.fromEntity(rolRepository.save(rol));
        }).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
    }

    public void eliminar(Long id) {
        rolRepository.deleteById(id);
    }
} 