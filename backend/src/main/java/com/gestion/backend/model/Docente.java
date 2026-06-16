package com.gestion.backend.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "docente")
@NoArgsConstructor
@Getter
@Setter
public class Docente {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "docente_seq_gen")
    @SequenceGenerator(name = "docente_seq_gen", sequenceName = "docente_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false, unique = true)
    private String dni;

    @Column(nullable = true, unique = true)
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @OneToMany(mappedBy = "docente", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<AsignacionDocente> asignacionesDocente;
}
