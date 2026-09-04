package com.gestion.backend.service;

import com.gestion.backend.dto.LoginRequestDto;
import com.gestion.backend.dto.LoginResponseDto;
import com.gestion.backend.model.Usuario;
import com.gestion.backend.repository.UsuarioRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final String SECRET_KEY = "FirmaSecretaParaTFIUNLa2026_DebeSerMuyLargaParaSerSegura";

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

        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            return new LoginResponseDto(false, "Contraseña incorrecta");
        }

        usuario.setUltimoAcceso(LocalDateTime.now());
        usuarioRepository.save(usuario);

        // DOC: [EV-21] Inyección de claims personalizados (role y docenteId) en el payload del JWT para ser consumidos por el Frontend (React).
        Map<String, Object> claims = new HashMap<>();
        if (usuario.getRol() != null) {
            claims.put("role", usuario.getRol().name());
        }

        if (usuario.getDocente() != null) {
            claims.put("docenteId", usuario.getDocente().getId());
        }

        String token = Jwts.builder()
                .setClaims(claims)
                .setSubject(usuario.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY.getBytes())
                .compact();

        return new LoginResponseDto(
                true,
                "Login exitoso",
                usuario.getUsername(),
                usuario.getNombre(),
                token
        );
    }
}