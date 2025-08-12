package com.gestion.backend.controller;

import com.gestion.backend.dto.PlanDto;
import com.gestion.backend.service.PlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/planes")
public class PlanController {

    @Autowired
    private PlanService planService;

    @GetMapping
    public List<PlanDto> listarTodos() {
        return planService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanDto> obtenerPorId(@PathVariable Long id) {
        return planService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PlanDto> crear(@RequestBody PlanDto planDto) {
        return ResponseEntity.ok(planService.crear(planDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanDto> actualizar(@PathVariable Long id, @RequestBody PlanDto planDto) {
        return ResponseEntity.ok(planService.actualizar(id, planDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        planService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
} 