package com.gestion.backend.repository;

import com.gestion.backend.model.AsignacionDocente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AsignacionDocenteRepository extends JpaRepository<AsignacionDocente, Long> {
} 