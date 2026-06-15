package com.gestion.backend.service;

import com.gestion.backend.model.AsignacionDocente;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:no-reply@unla.edu.ar}")
    private String emailOrigen;

    /**
     * Envía un correo de notificación al docente confirmando su asignación
     */
    @Async
    public void enviarConfirmacionAsignacion(AsignacionDocente asignacionDocente) {
        try {
            if (asignacionDocente == null || asignacionDocente.getDocente() == null) {
                logger.warn("AsignacionDocente o Docente es nulo, no se puede enviar correo");
                return;
            }

            String emailDocente = asignacionDocente.getDocente().getEmail();
            if (emailDocente == null || emailDocente.trim().isEmpty()) {
                logger.warn("El docente {} no tiene email registrado", asignacionDocente.getDocente().getNombre());
                return;
            }

            String asunto = "Confirmación de Asignación Horaria - UNLa";
            String cuerpo = construirCuerpoCorreo(asignacionDocente);

            enviarCorreo(emailDocente, asunto, cuerpo);
            logger.info("Correo de confirmación enviado a: {}", emailDocente);

        } catch (Exception e) {
            logger.error("Error al enviar correo de confirmación: ", e);
            // No lanzamos excepción para no romper el flujo de confirmación
        }
    }

    /**
     * Envía un correo simple a un docente
     */
    private void enviarCorreo(String destinatario, String asunto, String cuerpo) {
        try {
            SimpleMailMessage mensaje = new SimpleMailMessage();
            mensaje.setFrom(emailOrigen);
            mensaje.setTo(destinatario);
            mensaje.setSubject(asunto);
            mensaje.setText(cuerpo);

            mailSender.send(mensaje);
        } catch (Exception e) {
            logger.error("Error al enviar correo a {}: ", destinatario, e);
            throw new RuntimeException("Error al enviar correo: " + e.getMessage());
        }
    }

    /**
     * Construye el cuerpo del correo con los detalles de la asignación
     */
    private String construirCuerpoCorreo(AsignacionDocente asignacionDocente) {
        StringBuilder cuerpo = new StringBuilder();

        cuerpo.append("Estimado/a ").append(asignacionDocente.getDocente().getNombre()).append(",\n\n");

        cuerpo.append("Le informamos que su asignación horaria ha sido confirmada en el sistema de gestión docente de la Universidad Nacional de Lanus.\n\n");

        cuerpo.append("--- DETALLES DE LA ASIGNACIÓN ---\n");

        // Información del docente
        cuerpo.append("Docente: ").append(asignacionDocente.getDocente().getNombre()).append("\n");
        cuerpo.append("Categoría: ").append(
                asignacionDocente.getDocente().getCategoria() != null ?
                asignacionDocente.getDocente().getCategoria().getNombre() : "N/A"
        ).append("\n");

        // Información de la asignación
        if (asignacionDocente.getAsignacion() != null) {
            cuerpo.append("Materia: ").append(
                    asignacionDocente.getAsignacion().getMateria() != null ?
                    asignacionDocente.getAsignacion().getMateria().getNombre() : "N/A"
            ).append("\n");

            cuerpo.append("Comisión: ").append(
                    asignacionDocente.getAsignacion().getComision() != null ?
                    asignacionDocente.getAsignacion().getComision() : "N/A"
            ).append("\n");

            cuerpo.append("Año: ").append(
                    asignacionDocente.getAsignacion().getAnio() != null ?
                    asignacionDocente.getAsignacion().getAnio() : "N/A"
            ).append("\n");

            cuerpo.append("Cuatrimestre: ").append(
                    asignacionDocente.getAsignacion().getCuatrimestre() != null ?
                    asignacionDocente.getAsignacion().getCuatrimestre().getNumeroCuatri() : "N/A"
            ).append("\n");

            cuerpo.append("Día: ").append(
                    asignacionDocente.getAsignacion().getDia() != null ?
                    asignacionDocente.getAsignacion().getDia() : "N/A"
            ).append("\n");

            cuerpo.append("Turno: ").append(
                    asignacionDocente.getAsignacion().getTurno() != null ?
                    asignacionDocente.getAsignacion().getTurno() : "N/A"
            ).append("\n");
        }

        cuerpo.append("Horas Asignadas: ").append(asignacionDocente.getHorasAsignadas()).append("\n");
        cuerpo.append("Rol: ").append(
                asignacionDocente.getRol() != null ?
                asignacionDocente.getRol().getNombre() : "N/A"
        ).append("\n");

        cuerpo.append("\n--- FIN DE LA ASIGNACIÓN ---\n\n");

        cuerpo.append("Si tiene alguna consulta o necesita realizar cambios, por favor comuníquese con la coordinación académica.\n\n");

        cuerpo.append("Atentamente,\n");
        cuerpo.append("Sistema de Gestión Docente - UNLa\n");
        cuerpo.append("Universidad Nacional de Lanus");

        return cuerpo.toString();
    }
}

