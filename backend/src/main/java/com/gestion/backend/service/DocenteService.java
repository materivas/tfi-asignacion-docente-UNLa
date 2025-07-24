package com.gestion.backend.service;

import com.gestion.backend.dto.DocenteDto;
import com.gestion.backend.dto.CategoriaDto;
import com.gestion.backend.model.Categoria;
import com.gestion.backend.model.Docente;
import com.gestion.backend.model.AsignacionDocente;
import com.gestion.backend.repository.DocenteRepository;
import com.gestion.backend.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DocenteService {

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<DocenteDto> listarTodos() {
        return docenteRepository.findAll().stream().map(DocenteDto::fromEntity).toList();
    }

    public Optional<DocenteDto> obtenerPorId(Long id) {
        return docenteRepository.findById(id).map(DocenteDto::fromEntity);
    }

    @Transactional
    public DocenteDto crear(DocenteDto dto) {
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
            .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
        var docente = DocenteDto.toEntity(dto, categoria);
        return DocenteDto.fromEntity(docenteRepository.save(docente));
    }

    public DocenteDto actualizar(Long id, DocenteDto dto) {
        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
            .orElseThrow(() -> new RuntimeException("Categoria no encontrada"));
        return docenteRepository.findById(id).map(docente -> {
            docente.setNombre(dto.getNombre());
            docente.setDni(dto.getDni());
            docente.setCategoria(categoria);
            return DocenteDto.fromEntity(docenteRepository.save(docente));
        }).orElseThrow(() -> new RuntimeException("Docente no encontrado"));
    }

    public void eliminar(Long id) {
        docenteRepository.deleteById(id);
    }
}
