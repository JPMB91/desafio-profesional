package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.dto.ReservationResponseDTO;
import com.digitalhouse.turnos.entity.Reservation;
import com.digitalhouse.turnos.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponseDTO> createReservation(
            @RequestParam("startDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            // @RequestParam("startDate") LocalDate startDate,
//          @RequestParam("endDate") LocalDate endDate,
            @RequestParam("userId") UUID userId,
            @RequestParam("vehicleId") UUID vehicleId) {

        Reservation reservation = reservationService.createReserve(startDate, endDate, userId, vehicleId);

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
