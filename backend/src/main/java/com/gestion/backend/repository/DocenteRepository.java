package com.gestion.backend.repository;

import com.gestion.backend.model.Docente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocenteRepository extends JpaRepository<Docente, Long> {
    boolean existsByDni(String dni);
}
