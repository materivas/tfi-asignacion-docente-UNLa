package com.gestion.backend.controller;

import com.gestion.backend.dto.MateriaDto;
import com.gestion.backend.service.MateriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
public class MateriaController {

    @Autowired
    private MateriaService materiaService;

    @GetMapping
    public List<MateriaDto> listarTodos() {
        return materiaService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<MateriaDto> obtenerPorId(@PathVariable Long id) {
        return materiaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MateriaDto> crear(@RequestBody MateriaDto materiaDto) {
        return ResponseEntity.ok(materiaService.crear(materiaDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MateriaDto> actualizar(@PathVariable Long id, @RequestBody MateriaDto materiaDto) {
        return ResponseEntity.ok(materiaService.actualizar(id, materiaDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        materiaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
} 