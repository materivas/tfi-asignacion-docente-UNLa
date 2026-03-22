package com.gestion.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.text.Normalizer;
import java.util.Locale;

@Entity
@Table(name = "asignacion")
@NoArgsConstructor
@Getter
@Setter
public class Asignacion {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "asignacion_seq_gen")
    @SequenceGenerator(name = "asignacion_seq_gen", sequenceName = "asignacion_seq", allocationSize = 1)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materia_id", nullable = false)
    @JsonIgnore
    private Materia materia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cuatrimestre_id", nullable = false)
    @JsonIgnore
    private Cuatrimestre cuatrimestre;

    @Column(name = "turno")
    private String turno;

    @Column(name = "anio")
    private Integer anio;

    @Column(name = "dia")
    private String dia;

    @Column(name = "comision", length = 50)
    private String comision;

    // Metodo para generar comision: {codigo_materia}-1 + {turno_abreviado}
    public void generarComision() {
        if (this.materia != null && this.materia.getCodigo() != null && this.turno != null) {
            String codigoParte = this.materia.getCodigo() + "-1";
            String turnoAbreviado = abreviarTurno(this.turno);
            this.comision = codigoParte + " " + turnoAbreviado;
        }
    }

    private String abreviarTurno(String turno) {
        if (turno == null) return "";

        String turnoNormalizado = Normalizer.normalize(turno, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .trim();

        if (turnoNormalizado.contains("manana") || turnoNormalizado.contains("maniana")) return "TM";
        if (turnoNormalizado.contains("tarde")) return "TT";
        if (turnoNormalizado.contains("noche")) return "TN";
        return "";
    }
}
