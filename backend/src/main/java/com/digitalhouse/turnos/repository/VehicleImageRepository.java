package com.digitalhouse.turnos.repository;


import com.digitalhouse.turnos.entity.VehicleImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleImageRepository extends JpaRepository<VehicleImage, Long> {
    void deleteByFilename(String filename);
}
