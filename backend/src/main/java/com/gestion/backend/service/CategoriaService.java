package com.gestion.backend.service;

import com.gestion.backend.model.*;
import com.gestion.backend.repository.*;
import com.gestion.backend.dto.CategoriaDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<CategoriaDto> listarTodos() {
        return categoriaRepository.findAll().stream().map(CategoriaDto::fromEntity).toList();
    }

    public Optional<CategoriaDto> obtenerPorId(Long id) {
        return categoriaRepository.findById(id).map(CategoriaDto::fromEntity);
    }

    public CategoriaDto crear(CategoriaDto dto) {
        var categoria = CategoriaDto.toEntity(dto);
        return CategoriaDto.fromEntity(categoriaRepository.save(categoria));
    }

    public CategoriaDto actualizar(Long id, CategoriaDto dto) {
        return categoriaRepository.findById(id).map(categoria -> {
            categoria.setNombre(dto.getNombre());
            categoria.setMaxMaterias(dto.getMaxMaterias());
            return CategoriaDto.fromEntity(categoriaRepository.save(categoria));
        }).orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
    }

    public void eliminar(Long id) {
        categoriaRepository.deleteById(id);
    }
}
