package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.entity.Reservation;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    public void sendHtmlEmail(String to, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);

        mailSender.send(message);
    }


    @Async
    public void sendReservationEmail(Reservation reservation) {

        try {
            String to = reservation.getUser().getEmail();
            String subject = "Confirmación de reserva - "+ reservation.getVehicle().getName();
            String htmlBody = reservationEmailBody(reservation);
            sendHtmlEmail(to,subject,htmlBody);
        }catch (MessagingException e  ){
            System.err.println("Error al enviar correo de confirmación de reserva: "+e);
            logger.error("Error al enviar correo de confirmación de reserva: "+e);
        }

    }

    private String reservationEmailBody(Reservation reservation) {
        return String.format(
                "<html>" +
                        "<head>" +
                        "  <style>" +
                        "    body { font-family: Arial, sans-serif; }" +
                        "    h2 { color: #0076DC; }" +
                        "    ul { list-style-type: none; padding: 0; }" +
                        "    li { margin-bottom: 8px; }" +
                        "  </style>" +
                        "</head>" +
                        "<body>" +
                        "  <h2>Confirmación de Reserva</h2>" +
                        "  <p>Hola %s,</p>" +
                        "  <p>Tu reserva ha sido confirmada :</p>" +
                        "  <ul>" +
                        "    <li><strong>Vehículo:</strong> %s</li>" +
                        "    <li><strong>Número de Reserva:</strong> %s</li>" +
                        "    <li><strong>Fecha de Inicio:</strong> %s</li>" +
                        "    <li><strong>Fecha de Término:</strong> %s</li>" +
                        "    <li><strong>Ubicación:</strong> Aeropuerto Internacional Arturo Merino Benítez, Armando Cortinez Ote. 1704, Pudahuel, Región Metropolitana, Chile</li>" +
                        "  </ul>" +
                        "  <p>Gracias por confiar en Aurora Motors.</p>" +
                        "  <p>Teléfono de contacto: +569 33691660.</p>" +
                        "  <p>E-mail: auroramotorsctd@gmail.com</p>" +
                        "</body>" +
                        "</html>",
                reservation.getUser().getFirstName(),
                reservation.getVehicle().getName(),
                reservation.getId(),
                reservation.getStartDate(),
                reservation.getEndDate()
        );
    }

}
