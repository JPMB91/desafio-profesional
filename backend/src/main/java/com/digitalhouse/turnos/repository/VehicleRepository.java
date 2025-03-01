package com.digitalhouse.turnos.repository;

import com.digitalhouse.turnos.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

}
