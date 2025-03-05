package com.digitalhouse.turnos.repository;

import com.digitalhouse.turnos.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

    @Query("SELECT v FROM Vehicle v WHERE LOWER(v.category.name) = LOWER(:categoryName)")
    List<Vehicle> findByCategoryName(@Param("categoryName") String categoryName);


    @Query("SELECT v FROM Vehicle v WHERE " +
            "LOWER(v.brand) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(v.model) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(v.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(v.gearShift) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(v.fuelType) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(v.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "CAST(v.manufacturingYear AS string) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "EXISTS (SELECT c FROM v.characteristics c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Vehicle> findByKeyword(@Param("keyword") String keyword);
}
