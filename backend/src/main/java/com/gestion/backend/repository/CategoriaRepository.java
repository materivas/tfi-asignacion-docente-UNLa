package com.gestion.backend.repository;

import com.gestion.backend.model.Categoria;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Optional<Categoria> findByNombreIgnoreCase(String nombre);
}