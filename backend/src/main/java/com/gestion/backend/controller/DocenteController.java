package com.gestion.backend.controller;
import com.gestion.backend.repository.CategoriaRepository;
import com.gestion.backend.repository.DocenteRepository;
import com.gestion.backend.dto.DocenteDto;
import com.gestion.backend.model.Categoria;
import com.gestion.backend.model.Docente;
import com.gestion.backend.service.DocenteService;

import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	


	@PostMapping("/importar-excel")
	public ResponseEntity<?> importarDocentesDesdeExcel(@RequestParam("archivo") MultipartFile archivo) {
		if (archivo.isEmpty()) {
			return ResponseEntity.badRequest().body("Archivo vacío");
		}
		try {
			Map<String, Object> resultado = docenteService.importarDocentesDesdeExcel(archivo);
			return ResponseEntity.ok(resultado);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al leer el archivo");
		}
	}
}
