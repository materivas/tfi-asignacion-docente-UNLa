package com.gestion.backend.controller;

import com.gestion.backend.dto.AuditoriaPaginaDto;
import com.gestion.backend.service.AuditoriaService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auditoria")
@PreAuthorize("hasRole('ADMIN')")
public class AuditoriaController {

    private final AuditoriaService auditoriaService;

    public AuditoriaController(AuditoriaService auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    @GetMapping("/historial")
    public AuditoriaPaginaDto buscarHistorial(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "20") int tamanio,
            @RequestParam(required = false) String entidad,
            @RequestParam(required = false) String autor) {
        return auditoriaService.buscarHistorial(pagina, tamanio, entidad, autor);
    }
}
