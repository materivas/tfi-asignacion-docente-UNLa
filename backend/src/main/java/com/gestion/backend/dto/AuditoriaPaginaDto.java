package com.gestion.backend.dto;

import java.util.List;

public record AuditoriaPaginaDto(
        List<AuditoriaEventoDto> contenido,
        int pagina,
        int tamanio,
        boolean hayMas) {
}
