package com.gestion.backend.dto;

public class LoginResponseDto {

    private boolean success;
    private String message;
    private String username;
    private String nombre;

    // DOC: [EV-21] Se agregó el atributo 'token' para devolver el JWT al frontend tras un login exitoso.
    private String token;

    // Constructores
    public LoginResponseDto() {
    }

    public LoginResponseDto(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public LoginResponseDto(boolean success, String message, String username, String nombre, String token) {
        this.success = success;
        this.message = message;
        this.username = username;
        this.nombre = nombre;
        this.token = token;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}