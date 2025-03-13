package com.digitalhouse.turnos.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


@ResponseStatus(HttpStatus.CONFLICT)
public class VehicleAlreadyReservedException extends RuntimeException {
    public VehicleAlreadyReservedException(String message) {
        super(message);
    }
}

