package com.gestion.backend.repository;

import com.gestion.backend.model.Asignacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AsignacionRepository extends JpaRepository<Asignacion, Long> {
    List<Asignacion> findByMateriaId(Long materiaId);
    void deleteByMateriaId(Long materiaId);
} 