package com.gestion.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "plan")
@NoArgsConstructor
@Getter
@Setter
public class Plan {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "plan_seq_gen")
    @SequenceGenerator(name = "plan_seq_gen", sequenceName = "plan_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @Column(length = 1000)
    private String descripcion;
}
