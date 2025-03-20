package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.dto.ReservationRequestDTO;
import com.digitalhouse.turnos.dto.ReservationResponseDTO;
import com.digitalhouse.turnos.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponseDTO> createReservation(@RequestBody ReservationRequestDTO requestDTO) {
        ReservationResponseDTO savedReservation = reservationService.createReservation(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReservation);
    }


    @GetMapping("/{email}")
    public ResponseEntity<?> getReservationsByUserEmail(@PathVariable("email") String email) {
        return ResponseEntity.ok(reservationService.getReservationByUserEmail(email));
    }
}
