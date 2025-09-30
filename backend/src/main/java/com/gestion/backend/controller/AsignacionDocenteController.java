package com.gestion.backend.controller;

import com.gestion.backend.dto.AsignacionDocenteDto;
import com.gestion.backend.service.AsignacionDocenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asignaciones-docentes")
public class AsignacionDocenteController {

    @Autowired
    private AsignacionDocenteService asignacionDocenteService;

    @GetMapping
    public List<AsignacionDocenteDto> listarTodos() {
        return asignacionDocenteService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AsignacionDocenteDto> obtenerPorId(@PathVariable Long id) {
        return asignacionDocenteService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AsignacionDocenteDto> crear(@RequestBody AsignacionDocenteDto asignacionDocenteDto) {
        return ResponseEntity.ok(asignacionDocenteService.crear(asignacionDocenteDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AsignacionDocenteDto> actualizar(@PathVariable Long id, @RequestBody AsignacionDocenteDto asignacionDocenteDto) {
        return ResponseEntity.ok(asignacionDocenteService.actualizar(id, asignacionDocenteDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        asignacionDocenteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/importar-excel")
    public ResponseEntity<?> importarAsignacionDocentesDesdeExcel(@RequestParam("archivo") org.springframework.web.multipart.MultipartFile archivo) {
        if (archivo.isEmpty()) {
            return ResponseEntity.badRequest().body("Archivo vacío");
        }
        try {
            var resultado = asignacionDocenteService.importarAsignacionDocentesDesdeExcel(archivo);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al importar: " + e.getMessage());
        }
    }
}
