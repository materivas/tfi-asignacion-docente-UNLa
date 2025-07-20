package com.gestion.backend.service;

import com.gestion.backend.model.Docente;
import com.gestion.backend.model.AsignacionDocente;
import com.gestion.backend.repository.DocenteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class DocenteService {

    @Autowired
    private DocenteRepository docenteRepository;

    public List<Docente> listarTodos() {
        return docenteRepository.findAll();
    }

    public Optional<Docente> obtenerPorId(Long id) {
        return docenteRepository.findById(id);
    }

    @Transactional
    public Docente crear(Docente docente) {
        // Si hay asignacionesDocente, establecer la relación bidireccional
        if (docente.getAsignacionesDocente() != null && !docente.getAsignacionesDocente().isEmpty()) {
            for (AsignacionDocente asignacionDocente : docente.getAsignacionesDocente()) {
                asignacionDocente.setDocente(docente);
            }
        }
        
        return docenteRepository.save(docente);
    }

    public Docente actualizar(Long id, Docente docenteActualizado) {
        return docenteRepository.findById(id).map(docente -> {
            docente.setNombre(docenteActualizado.getNombre());
            docente.setDni(docenteActualizado.getDni());
            docente.setCategoria(docenteActualizado.getCategoria());
            return docenteRepository.save(docente);
        }).orElseThrow(() -> new RuntimeException("Docente no encontrado"));
    }

    public void eliminar(Long id) {
        docenteRepository.deleteById(id);
    }
}
