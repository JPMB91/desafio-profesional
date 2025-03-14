package com.digitalhouse.turnos.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "reservations")
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private LocalDate startDate;
    private LocalDate endDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

//    @Enumerated(EnumType.STRING)
//    private ReservationState reservationState;

    public Reservation() {
    }

    public Reservation(LocalDate startDate, LocalDate endDate, User user, Vehicle vehicle
//                       ,ReservationState reservationState
    ) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.user = user;
        this.vehicle = vehicle;
//        this.reservationState = reservationState;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

//    public ReservationState getReserveState() {
//        return reservationState;
//    }
//
//    public void setReserveState(ReservationState reservationState) {
//        this.reservationState = reservationState;
//    }
}
