package com.gestion.backend.dto;

import java.util.List;

public record HistorialAsignacionPaginaDto(
        List<HistorialAsignacionDto> contenido,
        int pagina,
        int tamanio,
        boolean hayMas) {
}
