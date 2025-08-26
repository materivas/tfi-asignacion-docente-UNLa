package com.gestion.backend.controller;

import com.gestion.backend.dto.DocenteDto;
import com.gestion.backend.model.Docente;
import com.gestion.backend.service.DocenteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/docentes")
public class DocenteController {

	@Autowired
	private DocenteService docenteService;

	@GetMapping
	public List<DocenteDto> listarTodos() {
		return docenteService.listarTodos();
	}

	@GetMapping("/{id}")
	public ResponseEntity<DocenteDto> obtenerPorId(@PathVariable Long id) {
		return docenteService.obtenerPorId(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<?> crear(@RequestBody DocenteDto docenteDto) {
		try {
			DocenteDto nuevo = docenteService.crear(docenteDto);
			return ResponseEntity.ok(nuevo);
		} catch (RuntimeException e) {
			System.err.println("❌ Error al crear docente: " + e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
		} catch (Exception e) {
			e.printStackTrace(); // Log completo en consola
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error inesperado al crear docente.");
		}
	}

	@PutMapping("/{id}")
	public ResponseEntity<DocenteDto> actualizar(@PathVariable Long id, @RequestBody DocenteDto docenteDto) {
		return ResponseEntity.ok(docenteService.actualizar(id, docenteDto));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable Long id) {
		docenteService.eliminar(id);
		return ResponseEntity.noContent().build();
	}
}
