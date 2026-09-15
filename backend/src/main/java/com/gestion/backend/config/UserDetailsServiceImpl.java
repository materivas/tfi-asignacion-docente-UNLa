package com.gestion.backend.config;

import com.gestion.backend.model.Usuario;
import com.gestion.backend.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UserDetailsServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        String authority = usuario.getRol() != null ? usuario.getRol().name() : "ROLE_DOCENTE";

        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                .authorities(List.of(new SimpleGrantedAuthority(authority)))
                .accountExpired(false)
                .accountLocked(!Boolean.TRUE.equals(usuario.getActivo()))
                .credentialsExpired(false)
                .disabled(!Boolean.TRUE.equals(usuario.getActivo()))
                .build();
    }
}
