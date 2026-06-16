package com.gestion.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ConflictoHorarioException.class)
    public ResponseEntity<Map<String, String>> handleConflictoHorario(ConflictoHorarioException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT) // 409
                .body(Map.of(
                        "error", "CONFLICTO_HORARIO",
                        "mensaje", ex.getMessage()));
    }

    @ExceptionHandler(LimiteCargaDocenteException.class)
    public ResponseEntity<Map<String, String>> handleLimiteCargaDocente(LimiteCargaDocenteException ex) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of(
                        "error", "LIMITE_CARGA_DOCENTE",
                        "mensaje", ex.getMessage()));
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of(
                        "error", "ERROR_NEGOCIO",
                        "mensaje", ex.getMessage()));
    }
}
