package com.gestion.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "rol")
@NoArgsConstructor
@Getter
@Setter
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "rol_seq_gen")
    @SequenceGenerator(name = "rol_seq_gen", sequenceName = "rol_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

}
