package com.gestion.backend.dto;

public class LoginResponseDto {
    
    private boolean success;
    private String message;
    private String username;
    private String nombre;

    // Constructores
    public LoginResponseDto() {
    }

    public LoginResponseDto(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public LoginResponseDto(boolean success, String message, String username, String nombre) {
        this.success = success;
        this.message = message;
        this.username = username;
        this.nombre = nombre;
    }

    // Getters y Setters
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
