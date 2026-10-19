package com.gestion.backend.dto;

import java.time.Instant;
import java.util.Map;

public record AuditoriaEventoDto(
        Integer revision,
        Instant fecha,
        String autor,
        String entidad,
        Long entidadId,
        String accion,
        Map<String, Object> estado) {
}
