package com.gestion.backend.controller;

import com.gestion.backend.dto.CuatrimestreDto;
import com.gestion.backend.service.CuatrimestreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cuatrimestres")
public class CuatrimestreController {

    @Autowired
    private CuatrimestreService cuatrimestreService;

    @GetMapping
    public List<CuatrimestreDto> listarTodos() {
        return cuatrimestreService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CuatrimestreDto> obtenerPorId(@PathVariable Long id) {
        return cuatrimestreService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CuatrimestreDto> crear(@RequestBody CuatrimestreDto cuatrimestreDto) {
        return ResponseEntity.ok(cuatrimestreService.crear(cuatrimestreDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CuatrimestreDto> actualizar(@PathVariable Long id, @RequestBody CuatrimestreDto cuatrimestreDto) {
        return ResponseEntity.ok(cuatrimestreService.actualizar(id, cuatrimestreDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        cuatrimestreService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
} 