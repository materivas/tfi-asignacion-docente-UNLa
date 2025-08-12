package com.gestion.backend.controller;

import com.gestion.backend.dto.RolDto;
import com.gestion.backend.service.RolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    @Autowired
    private RolService rolService;

    @GetMapping
    public List<RolDto> listarTodos() {
        return rolService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RolDto> obtenerPorId(@PathVariable Long id) {
        return rolService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<RolDto> crear(@RequestBody RolDto rolDto) {
        return ResponseEntity.ok(rolService.crear(rolDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RolDto> actualizar(@PathVariable Long id, @RequestBody RolDto rolDto) {
        return ResponseEntity.ok(rolService.actualizar(id, rolDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        rolService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
} 