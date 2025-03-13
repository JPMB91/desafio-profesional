package com.digitalhouse.turnos.repository;

import com.digitalhouse.turnos.dto.ReviewResponseDTO;
import com.digitalhouse.turnos.dto.ReviewStatsDTO;
import com.digitalhouse.turnos.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // la cuenta de reviews de un vehiculo y su score promedio
    @Query("SELECT new com.digitalhouse.turnos.dto.ReviewStatsDTO(" +
            "COALESCE(ROUND(AVG(r.score), 1), 0), COUNT(r)) " +
            "FROM Review r WHERE r.vehicle.id = :vehicleId")
    ReviewStatsDTO getReviewStatsByVehicleId(@Param("vehicleId") UUID vehicleId);


    @Query("SELECT new com.digitalhouse.turnos.dto.ReviewResponseDTO(" +
            "r.id, r.vehicle.id, r.comment, r.createdAt, CONCAT(u.firstName, ' ', u.lastname), r.score) " +
            "FROM Review r JOIN r.user u WHERE r.vehicle.id = :vehicleId")
    List<ReviewResponseDTO> getReviewsByVehicleId(@Param("vehicleId") UUID vehicleId);


//    @Query("SELECT new com.digitalhouse.turnos.dto.ReviewResponseDTO(" +
//            "r.id, r.vehicle.id, r.comment, r.createdAt, CONCAT(u.firstName, ' ', u.lastname)) " +
//            "FROM Review r JOIN r.user u")
//    List<ReviewResponseDTO> getAllReviews();

}
