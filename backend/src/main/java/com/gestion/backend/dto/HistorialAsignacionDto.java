package com.gestion.backend.dto;

import java.time.Instant;
import java.util.Map;

public record HistorialAsignacionDto(
        Integer revision,
        Instant fecha,
        String autor,
        String entidad,
        String accion,
        Map<String, Object> estado) {
}
