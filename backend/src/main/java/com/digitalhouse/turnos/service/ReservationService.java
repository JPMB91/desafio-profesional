package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.dto.ReservationRequestDTO;
import com.digitalhouse.turnos.dto.ReservationResponseDTO;
import com.digitalhouse.turnos.entity.Reservation;
import com.digitalhouse.turnos.entity.User;
import com.digitalhouse.turnos.entity.Vehicle;
import com.digitalhouse.turnos.exception.UserNotFoundException;
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
    public ReservationResponseDTO createReservation(ReservationRequestDTO reservationDTO) {

        User user = userRepository.getByEmail(reservationDTO.getEmail());

        if (user == null) {
            throw new EntityNotFoundException("Usuario no encontrado");
        }

        Vehicle vehicle =
                vehicleRepository.findById(reservationDTO.getVehicleId()).orElseThrow(() -> new EntityNotFoundException("Veh" +
                        "ículo no encontrado"));

        // ver si esta disponible para reservas
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(vehicle.getId()
                , reservationDTO.getStartDate(), reservationDTO.getEndDate());

        if (!overlappingReservations.isEmpty()) {
            throw new VehicleAlreadyReservedException("Error: El vehículo ya está reservado en el período " + "seleccionado");
        }

        Reservation reservation = new Reservation(reservationDTO.getStartDate(), reservationDTO.getEndDate(), user,
                vehicle, reservationDTO.getMessage());
        Reservation savedReservation = reservationRepository.save(reservation);

        return convertToDTO(savedReservation);
    }


    public Map<String, Object> getVehicleReservedDates(UUID vehicleId) {
        Vehicle vehicle = vehicleService.getVehicle(vehicleId).orElseThrow(() -> new VehicleNotFoundException("Error:" +
                " Vehículo no encontrado"));

        List<Reservation> reservations = reservationRepository.findReservationsByVehicleId(
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

    public List<ReservationResponseDTO> getReservationByUserEmail(String email) {
        User user = userRepository.getByEmail(email);

        if (user == null) {
            throw new UserNotFoundException("Usuario no encontrado");

        }
        List<Reservation> reservations = reservationRepository.findReservationsByUserEmail(email);
        return reservations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public ReservationResponseDTO convertToDTO(Reservation reservation) {
        ReservationResponseDTO dto = new ReservationResponseDTO();
        dto.setId(reservation.getId());
        dto.setStartDate(reservation.getStartDate());
        dto.setEndDate(reservation.getEndDate());
        dto.setUserId(reservation.getUser().getId());
        dto.setUserFullName(reservation.getUser().getFirstName() + " " + reservation.getUser().getLastname()); //
        dto.setVehicleId(reservation.getVehicle().getId());
        dto.setVehicleName(reservation.getVehicle().getName());
        dto.setCreatedAt(reservation.getCreatedAt());
        return dto;
    }

}
