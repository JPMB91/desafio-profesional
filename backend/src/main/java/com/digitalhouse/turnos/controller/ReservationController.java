package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.dto.ReservationRequestDTO;
import com.digitalhouse.turnos.dto.ReservationResponseDTO;
import com.digitalhouse.turnos.entity.Reservation;
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
        Reservation reservation = reservationService.createReservation(
                requestDTO.getStartDate(),
                requestDTO.getEndDate(),
                requestDTO.getEmail(),
                requestDTO.getVehicleId(),
                requestDTO.getMessage()
        );

        ReservationResponseDTO reservationResponseDTO = convertToDTO(reservation);
        return ResponseEntity.status(HttpStatus.CREATED).body(reservationResponseDTO);
    }


    private ReservationResponseDTO convertToDTO(Reservation reservation) {
        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.setId(reservation.getId());
        dto.setStartDate(reservation.getStartDate());
        dto.setEndDate(reservation.getEndDate());
        dto.setUserId(reservation.getUser().getId());
        dto.setUserFullName(reservation.getUser().getFirstName() + " " + reservation.getUser().getLastname()); //
        dto.setVehicleId(reservation.getVehicle().getId());
        dto.setVehicleName(reservation.getVehicle().getName());
        return dto;
    }
}
