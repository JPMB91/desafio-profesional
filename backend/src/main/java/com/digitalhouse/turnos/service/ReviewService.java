package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.dto.ReviewDTO;
import com.digitalhouse.turnos.dto.ReviewResponseDTO;
import com.digitalhouse.turnos.dto.ReviewStatsDTO;
import com.digitalhouse.turnos.entity.Review;
import com.digitalhouse.turnos.entity.User;
import com.digitalhouse.turnos.entity.Vehicle;
import com.digitalhouse.turnos.repository.ReservationRepository;
import com.digitalhouse.turnos.repository.ReviewRepository;
import com.digitalhouse.turnos.repository.UserRepository;
import com.digitalhouse.turnos.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ReviewService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ReviewResponseDTO saveReview(ReviewDTO reviewDTO) {

        User user = userRepository.getByEmail(reviewDTO.getEmail());
        Vehicle vehicle = vehicleRepository.findById(reviewDTO.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Review review = new Review(reviewDTO.getComment(), user, vehicle, reviewDTO.getScore());
        Review savedReview = reviewRepository.save(review);

        String userName = user.getFirstName() + " " + user.getLastname();

        return new ReviewResponseDTO(
                savedReview.getId(),
                vehicle.getId(),
                savedReview.getComment(),
                savedReview.getCreatedAt(),
                userName,
                reviewDTO.getScore()
        );
    }


    public List<ReviewResponseDTO> getAllReviewsByVehicleId(UUID vehicleId) {
        return reviewRepository.getReviewsByVehicleId(vehicleId);
    }


    public ReviewStatsDTO getVehicleReviewStats(UUID vehicleId) {
        return reviewRepository.getReviewStatsByVehicleId(vehicleId);
    }


}
