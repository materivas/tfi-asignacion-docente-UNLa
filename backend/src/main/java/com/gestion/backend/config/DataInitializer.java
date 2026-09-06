package com.gestion.backend.config;

import com.gestion.backend.model.RoleType;
import com.gestion.backend.model.Usuario;
import com.gestion.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        if (!usuarioRepository.existsByUsername("superadmin")) {
            Usuario admin = new Usuario();
            admin.setUsername("superadmin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNombre("Director General");
            admin.setEmail("admin@unla.edu.ar");
            admin.setActivo(true);
            // Asignación explícita del rol de Administrador
            admin.setRol(RoleType.ROLE_ADMIN);
            usuarioRepository.save(admin);
        }

        if (!usuarioRepository.existsByUsername("profe")) {
            Usuario docente = new Usuario();
            docente.setUsername("profe");
            docente.setPassword(passwordEncoder.encode("profe123"));
            docente.setNombre("Docente de Prueba");
            docente.setEmail("docente@unla.edu.ar");
            docente.setActivo(true);
            // Asignación explícita del rol de Docente
            docente.setRol(RoleType.ROLE_DOCENTE);
            usuarioRepository.save(docente);
        }
    }
}