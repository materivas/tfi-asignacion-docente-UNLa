package com.gestion.backend.controller;

import com.gestion.backend.model.Docente;
import com.gestion.backend.service.DocenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docentes")
public class DocenteController {

    @Autowired
    private DocenteService docenteService;


    @GetMapping
    public List<Docente> listarTodos() {
        return docenteService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Docente> obtenerPorId(@PathVariable Long id) {
        return docenteService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Docente> crear(@RequestBody Docente docente) {
        return ResponseEntity.ok(docenteService.crear(docente));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Docente> actualizar(@PathVariable Long id, @RequestBody Docente docente) {
        return ResponseEntity.ok(docenteService.actualizar(id, docente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        docenteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
