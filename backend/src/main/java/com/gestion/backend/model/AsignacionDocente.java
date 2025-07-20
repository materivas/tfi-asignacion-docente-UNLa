package com.gestion.backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "asignacion_docente")
@NoArgsConstructor
@Getter
@Setter
public class AsignacionDocente {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "asig_docente_seq_gen")
    @SequenceGenerator(name = "asig_docente_seq_gen", sequenceName = "asignacion_docente_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asignacion_id", nullable = false)
    private Asignacion asignacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false)
    @JsonBackReference
    private Docente docente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;

    @Column(name = "horas_asignadas", nullable = false)
    private Integer horasAsignadas;

    @Column(name = "confirmado", nullable = false)
    private Boolean confirmado;
}
