package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.entity.Reservation;
import com.digitalhouse.turnos.entity.User;
import com.digitalhouse.turnos.entity.Vehicle;
import com.digitalhouse.turnos.exception.VehicleAlreadyReservedException;
import com.digitalhouse.turnos.exception.VehicleNotFoundException;
import com.digitalhouse.turnos.repository.ReservationRepository;
import com.digitalhouse.turnos.repository.UserRepository;
import com.digitalhouse.turnos.repository.VehicleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private VehicleService vehicleService;


    @Transactional
    public Reservation createReservation(LocalDate startDate, LocalDate endDate, String email, UUID vehicleId, String message) {

        User user = userRepository.getByEmail(email);

        if (user == null) {
            throw new EntityNotFoundException("Usuario no encontrado");
        }

        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new EntityNotFoundException("Vehículo no encontrado"));

        // ver si esta disponible para reservas
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(vehicle.getId(), startDate, endDate);

        if (!overlappingReservations.isEmpty()) {
            throw new VehicleAlreadyReservedException("Error: El vehículo ya está reservado en el período " + "seleccionado");
        }

        Reservation reservation = new Reservation();
        reservation.setStartDate(startDate);
        reservation.setEndDate(endDate);
        reservation.setVehicle(vehicle);
        reservation.setUser(user);
        reservation.setMessage(message);

        return reservationRepository.save(reservation);
    }


    public Map<String, Object> getVehicleReservedDates(UUID vehicleId) {
        Vehicle vehicle = vehicleService.getVehicle(vehicleId).orElseThrow(() -> new VehicleNotFoundException("Error:" +
                " Vehículo no encontrado"));

        List<Reservation> reservations = reservationRepository.findReservationsByVehicleId(
                //LocalDateTime
                vehicleId, LocalDate.now());

        List<Map<String, Object>> reservedPeriods = reservations.stream().map(reservation -> {
            Map<String, Object> period = new HashMap<>();
            period.put("startDate", reservation.getStartDate().toString());
            period.put("endDate", reservation.getEndDate().toString());
            period.put("reservationId", reservation.getId().toString());
            return period;
        }).collect(Collectors.toList());

        Map<String, Object> reservedDates = new HashMap<>();
        reservedDates.put("vehicleId", vehicleId);
        reservedDates.put("vehicleName", vehicle.getName());
        reservedDates.put("reservedPeriods", reservedPeriods);

        return reservedDates;
    }


}
