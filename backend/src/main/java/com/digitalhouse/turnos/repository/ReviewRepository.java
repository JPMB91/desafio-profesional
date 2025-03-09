package com.digitalhouse.turnos.repository;

import com.digitalhouse.turnos.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> getReviewsByVehicleId(UUID vehicleId);

    Long countByVehicle_Id(UUID vehicleId);
}
