package com.gestion.backend.service;

import com.gestion.backend.dto.LoginRequestDto;
import com.gestion.backend.dto.LoginResponseDto;
import com.gestion.backend.model.Usuario;
import com.gestion.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public LoginResponseDto login(LoginRequestDto loginRequest) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(loginRequest.getUsername());

        if (usuarioOpt.isEmpty()) {
            return new LoginResponseDto(false, "Usuario no encontrado");
        }

        Usuario usuario = usuarioOpt.get();

        if (!usuario.getActivo()) {
            return new LoginResponseDto(false, "Usuario inactivo");
        }

        // Verificar contraseña
        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            return new LoginResponseDto(false, "Contraseña incorrecta");
        }

        // Actualizar último acceso
        usuario.setUltimoAcceso(LocalDateTime.now());
        usuarioRepository.save(usuario);

        return new LoginResponseDto(
            true, 
            "Login exitoso",
            usuario.getUsername(),
            usuario.getNombre()
        );
    }
}
