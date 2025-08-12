package com.gestion.backend.controller;

import com.gestion.backend.dto.AsignacionDto;
import com.gestion.backend.service.AsignacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asignaciones")
public class AsignacionController {

    @Autowired
    private AsignacionService asignacionService;

    @GetMapping
    public List<AsignacionDto> listarTodos() {
        return asignacionService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsignacionDto> obtenerPorId(@PathVariable Long id) {
        return asignacionService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AsignacionDto> crear(@RequestBody AsignacionDto asignacionDto) {
        return ResponseEntity.ok(asignacionService.crear(asignacionDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsignacionDto> actualizar(@PathVariable Long id, @RequestBody AsignacionDto asignacionDto) {
        return ResponseEntity.ok(asignacionService.actualizar(id, asignacionDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        asignacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
} 