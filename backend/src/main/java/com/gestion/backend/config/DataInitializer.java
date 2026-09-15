package com.gestion.backend.config;

import com.gestion.backend.model.Categoria;
import com.gestion.backend.model.Docente;
import com.gestion.backend.model.RoleType;
import com.gestion.backend.model.Usuario;
import com.gestion.backend.repository.CategoriaRepository;
import com.gestion.backend.repository.DocenteRepository;
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
    private CategoriaRepository categoriaRepository;

    @Autowired
    private DocenteRepository docenteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (categoriaRepository.count() == 0) {
            Categoria titular = new Categoria();
            titular.setNombre("Titular");
            titular.setMaxMaterias(4);
            categoriaRepository.save(titular);

            Categoria adjunto = new Categoria();
            adjunto.setNombre("Adjunto");
            adjunto.setMaxMaterias(3);
            categoriaRepository.save(adjunto);

            Categoria jtp = new Categoria();
            jtp.setNombre("JTP");
            jtp.setMaxMaterias(5);
            categoriaRepository.save(jtp);

            Categoria ayudante = new Categoria();
            ayudante.setNombre("Ayudante");
            ayudante.setMaxMaterias(6);
            categoriaRepository.save(ayudante);
        }

        if (docenteRepository.count() == 0) {
            Categoria categoriaTitular = categoriaRepository.findByNombreIgnoreCase("Titular")
                    .orElseGet(() -> categoriaRepository.findAll().stream().findFirst().orElse(null));

            if (categoriaTitular != null) {
                Docente docente = new Docente();
                docente.setNombre("Docente demo");
                docente.setDni("99999999");
                docente.setEmail("demo@unla.edu.ar");
                docente.setCategoria(categoriaTitular);
                docenteRepository.save(docente);
            }
        }

        if (!usuarioRepository.existsByUsername("superadmin")) {
            Usuario admin = new Usuario();
            admin.setUsername("superadmin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setNombre("Director General");
            admin.setEmail("admin@unla.edu.ar");
            admin.setActivo(true);
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
            docente.setRol(RoleType.ROLE_DOCENTE);
            usuarioRepository.save(docente);
        }
    }
}