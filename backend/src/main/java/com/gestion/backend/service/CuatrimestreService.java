package com.gestion.backend.service;

import com.gestion.backend.dto.CuatrimestreDto;
import com.gestion.backend.model.Cuatrimestre;
import com.gestion.backend.repository.CuatrimestreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CuatrimestreService {

    @Autowired
    private CuatrimestreRepository cuatrimestreRepository;

    public List<CuatrimestreDto> listarTodos() {
        return cuatrimestreRepository.findAll().stream().map(CuatrimestreDto::fromEntity).toList();
    }

    public Optional<CuatrimestreDto> obtenerPorId(Long id) {
        return cuatrimestreRepository.findById(id).map(CuatrimestreDto::fromEntity);
    }

    public CuatrimestreDto crear(CuatrimestreDto dto) {
        var cuatrimestre = CuatrimestreDto.toEntity(dto);
        return CuatrimestreDto.fromEntity(cuatrimestreRepository.save(cuatrimestre));
    }

    public CuatrimestreDto actualizar(Long id, CuatrimestreDto dto) {
        return cuatrimestreRepository.findById(id).map(cuatrimestre -> {
            cuatrimestre.setNumeroCuatri(dto.getNumeroCuatri());
            return CuatrimestreDto.fromEntity(cuatrimestreRepository.save(cuatrimestre));
        }).orElseThrow(() -> new RuntimeException("Cuatrimestre no encontrado"));
    }

    public void eliminar(Long id) {
        cuatrimestreRepository.deleteById(id);
    }
} 