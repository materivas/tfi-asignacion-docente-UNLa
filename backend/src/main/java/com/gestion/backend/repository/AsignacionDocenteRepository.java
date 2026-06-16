package com.gestion.backend.repository;

import com.gestion.backend.model.AsignacionDocente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsignacionDocenteRepository extends JpaRepository<AsignacionDocente, Long> {
    List<AsignacionDocente> findByAsignacionId(Long asignacionId);
    void deleteByAsignacionId(Long asignacionId);
    void deleteByAsignacionIdIn(List<Long> asignacionIds);
} 