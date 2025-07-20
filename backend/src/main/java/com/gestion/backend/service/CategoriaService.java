package com.gestion.backend.service;

import com.gestion.backend.model.Categoria;
import com.gestion.backend.model.Docente;
import com.gestion.backend.repository.CategoriaRepository;
import com.gestion.backend.repository.DocenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Categoria> listarTodos() {
        return categoriaRepository.findAll();
    }

    public Optional<Categoria> obtenerPorId(Long id) {
        return categoriaRepository.findById(id);
    }

    public Categoria crear(Categoria docente) {
        return categoriaRepository.save(docente);
    }

    public Categoria actualizar(Long id, Categoria categoriaActualizado) {
        return categoriaRepository.findById(id).map(categoria -> {
            categoria.setNombre(categoriaActualizado.getNombre());
            categoria.setMaxMaterias(categoriaActualizado.getMaxMaterias());

            return categoriaRepository.save(categoria);
        }).orElseThrow(() -> new RuntimeException("Categoria no encontrado"));
    }

    public void eliminar(Long id) {
        categoriaRepository.deleteById(id);
    }
}
