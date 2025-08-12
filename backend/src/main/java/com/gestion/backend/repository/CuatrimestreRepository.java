package com.gestion.backend.repository;

import com.gestion.backend.model.Cuatrimestre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CuatrimestreRepository extends JpaRepository<Cuatrimestre, Long> {
} 