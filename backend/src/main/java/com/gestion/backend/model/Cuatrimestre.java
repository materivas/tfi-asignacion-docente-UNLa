package com.gestion.backend.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "cuatrimestre")
@NoArgsConstructor
@Getter
@Setter
public class Cuatrimestre {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "cuatri_seq_gen")
    @SequenceGenerator(name = "cuatri_seq_gen", sequenceName = "cuatrimestre_seq", allocationSize = 1)
    private Long id;

    @Column(name = "numero_cuatri", nullable = false)
    private Integer numeroCuatri;

    @OneToMany(mappedBy = "cuatrimestre", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Asignacion> asignaciones;
}
