package com.digitalhouse.turnos.repository;

import com.digitalhouse.turnos.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
//    List<Vehicle> findByCategoryName(String name);

    @Query("SELECT v FROM Vehicle v WHERE LOWER(v.category.name) = LOWER(:categoryName)")
    List<Vehicle> findByCategoryName(@Param("categoryName") String categoryName);
}
