package com.gestion.backend.controller;

import com.gestion.backend.dto.CategoriaDto;
import com.gestion.backend.model.*;
import com.gestion.backend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;


    @GetMapping
    public List<CategoriaDto> listarTodos() {
        return categoriaService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoriaDto> obtenerPorId(@PathVariable Long id) {
        return categoriaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CategoriaDto> crear(@RequestBody CategoriaDto categoriaDto) {
        return ResponseEntity.ok(categoriaService.crear(categoriaDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoriaDto> actualizar(@PathVariable Long id, @RequestBody CategoriaDto categoriaDto) {
        return ResponseEntity.ok(categoriaService.actualizar(id, categoriaDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        categoriaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
