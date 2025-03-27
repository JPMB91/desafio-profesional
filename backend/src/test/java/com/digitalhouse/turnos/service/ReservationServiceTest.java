package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.dto.ReservationRequestDTO;
import com.digitalhouse.turnos.dto.ReservationResponseDTO;
import com.digitalhouse.turnos.entity.Reservation;
import com.digitalhouse.turnos.entity.Role;
import com.digitalhouse.turnos.entity.User;
import com.digitalhouse.turnos.entity.Vehicle;
import com.digitalhouse.turnos.repository.ReservationRepository;
import com.digitalhouse.turnos.repository.UserRepository;
import com.digitalhouse.turnos.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class ReservationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private ReservationRepository reservationRepository;

    @Mock
    private EmailService emailService;
    @Mock
    private VehicleService vehicleService;

    @InjectMocks
    private ReservationService reservationService;

    private User user;
    private Role roleUser;
    private ReservationRequestDTO reservationRequestDTO;

    private Vehicle vehicle;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setEmail("test@test.com");
        user.setFirstName("Test");
        user.setLastname("User");
        user.setPassword("encodedPassword");
        user.setEnabled(true);

        roleUser = new Role();
        roleUser.setId(1);
        roleUser.setName("ROLE_USER");

        vehicle = new Vehicle();
        UUID vehicleId = UUID.randomUUID();
        vehicle.setId(vehicleId);
        vehicle.setBrand("Toyota");
        vehicle.setModel("Corolla");

        reservationRequestDTO = new ReservationRequestDTO();
        reservationRequestDTO.setEmail("test@test.com");
        reservationRequestDTO.setCreatedAt(LocalDateTime.now());
        reservationRequestDTO.setVehicleId(vehicleId);
        reservationRequestDTO.setStartDate(LocalDate.of((2025), (5), (10)));
        reservationRequestDTO.setEndDate(LocalDate.of((2025), (5), (12)));
        reservationRequestDTO.setMessage("");

    }

    @Test
    void createReservation() {
        when(userRepository.getByEmail(user.getEmail())).thenReturn(user);
        when(vehicleRepository.findById(vehicle.getId())).thenReturn(Optional.ofNullable(vehicle));
        when(reservationRepository.findOverlappingReservations(vehicle.getId(), reservationRequestDTO.getStartDate(),
                reservationRequestDTO.getEndDate())).thenReturn(Collections.emptyList());

        when(reservationRepository.save(any(Reservation.class)))
                .thenAnswer(invocation -> {
                    Reservation reservation = invocation.getArgument(0);
                    reservation.setId(UUID.randomUUID());
                    return reservation;
                });

        // se guarda la reservación
        ReservationResponseDTO responseDTO = reservationService.createReservation(reservationRequestDTO);

        assertNotNull(responseDTO.getId());
        assertEquals(user.getId(), responseDTO.getUserId());
        assertEquals(vehicle.getId(), responseDTO.getVehicleId());

        // verificando los argumentos pasados al metodo de email service
        ArgumentCaptor<Reservation> captor = ArgumentCaptor.forClass(Reservation.class);
        verify(emailService).sendReservationEmail(captor.capture());
        Reservation capturedReservation = captor.getValue();
        assertNotNull(capturedReservation.getId());
        assertEquals(user.getEmail(), capturedReservation.getUser().getEmail());
    }

    @Test
    void getVehicleReservedDates() {
        when(vehicleService.getVehicle(vehicle.getId())).thenReturn(Optional.ofNullable(vehicle));
        when(reservationRepository.findReservationsByVehicleId(vehicle.getId(), LocalDate.now())).thenReturn(Collections.emptyList());

        Map<String, Object> result = reservationService.getVehicleReservedDates(vehicle.getId());

        assertEquals(vehicle.getId(), result.get("vehicleId"));
        assertEquals(vehicle.getName(), result.get("vehicleName"));
    }

}
