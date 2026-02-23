package com.gestion.backend.controller;

import com.gestion.backend.dto.AsignacionDto;
import com.gestion.backend.service.AsignacionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
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

    @GetMapping("/exportar-excel")
    public ResponseEntity<byte[]> exportarCalendarioExcel(
            @RequestParam(value = "anio", required = false) Integer anio,
            @RequestParam(value = "cuatrimestre", required = false) Integer cuatrimestre) {
        try {
            ByteArrayOutputStream baos = asignacionService.exportarCalendarioExcel(anio, cuatrimestre);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            String filename = "calendario_docentes" + (anio != null ? "_" + anio : "") + ".xlsx";
            headers.setContentDispositionFormData("attachment", filename);
            return ResponseEntity.ok().headers(headers).body(baos.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/importar-excel")
    public ResponseEntity<?> importarAsignacionesDesdeExcel(@RequestParam("archivo") org.springframework.web.multipart.MultipartFile archivo) {
        if (archivo.isEmpty()) {
            return ResponseEntity.badRequest().body("Archivo vacío");
        }
        try {
            var resultado = asignacionService.importarAsignacionesDesdeExcel(archivo);
            return ResponseEntity.ok(resultado);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al importar: " + e.getMessage());
        }
    }
}
