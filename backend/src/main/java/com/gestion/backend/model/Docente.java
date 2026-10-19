package com.gestion.backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.hibernate.envers.Audited;
import org.hibernate.envers.RelationTargetAuditMode;

@Entity
@Audited
@Table(name = "docente")
public class Docente extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El DNI es obligatorio")
    private String dni;

    @Email(message = "El email debe ser válido")
    private String email;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    private Categoria categoria;

    @Enumerated(EnumType.STRING)
    private Dedicacion dedicacion;

    @Column(nullable = false)
    private Boolean concursado = false;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    @Audited(targetAuditMode = RelationTargetAuditMode.NOT_AUDITED)
    private Usuario usuario;

    public Docente() {
    }

    public Docente(Long id, String nombre, String dni, String email, Categoria categoria, Dedicacion dedicacion, Boolean concursado, Usuario usuario) {
        this.id = id;
        this.nombre = nombre;
        this.dni = dni;
        this.email = email;
        this.categoria = categoria;
        this.dedicacion = dedicacion;
        this.concursado = concursado != null ? concursado : false;
        this.usuario = usuario;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }

    public Dedicacion getDedicacion() {
        return dedicacion;
    }

    public void setDedicacion(Dedicacion dedicacion) {
        this.dedicacion = dedicacion;
    }

    public Boolean getConcursado() {
        return concursado;
    }

    public void setConcursado(Boolean concursado) {
        this.concursado = concursado != null ? concursado : false;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
