package com.digitalhouse.turnos.repository;

import com.digitalhouse.turnos.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    @Query("SELECT r FROM Reservation r WHERE r.vehicle.id = :vehicleId AND r.endDate > :today ORDER BY r.startDate")
    List<Reservation> findReservationsByVehicleId(
            @Param("vehicleId") UUID vehicleId,
            @Param("today") LocalDate today
    );


    @Query("SELECT r FROM Reservation r WHERE r.vehicle.id = :vehicleId " +
            "AND (r.startDate <= :endDate) " +
            "AND (r.endDate >= :startDate)")
    List<Reservation> findOverlappingReservations(
            @Param("vehicleId") UUID vehicleId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);


    List<Reservation> findReservationsByUserEmail(String email);


}
