package com.gestion.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

@Entity
@Audited
@Table(name = "materia")
@NoArgsConstructor
@Getter
@Setter
public class Materia extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "materia_seq_gen")
    @SequenceGenerator(name = "materia_seq_gen", sequenceName = "materia_seq", allocationSize = 1)
    private Long id;

    @Column(name = "nombre", nullable = false, unique = true)
    private String nombre;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plan_id", nullable = false)
    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    @JsonIgnore
    private Plan plan;

    @Column(name = "anio")
    private Integer anio;

    @Column(name = "codigo")
    private Integer codigo;
}
