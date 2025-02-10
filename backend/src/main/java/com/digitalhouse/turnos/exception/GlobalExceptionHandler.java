package com.digitalhouse.turnos.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        String message = ex.getMostSpecificCause().getMessage();

        if (message.contains("UK_vehiculo_nombre")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: El nombre del vehiculo debe ser único.");
        } else if (message.contains("UK_vehiculo_matricula")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: La matrícula ya está registrada.");
        }

        //

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Violación de integridad de datos.");
    }
}