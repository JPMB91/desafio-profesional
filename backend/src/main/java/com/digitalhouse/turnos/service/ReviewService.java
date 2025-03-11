package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.dto.ReviewDTO;
import com.digitalhouse.turnos.entity.Review;
import com.digitalhouse.turnos.entity.User;
import com.digitalhouse.turnos.entity.Vehicle;
import com.digitalhouse.turnos.exception.UserNotFoundException;
import com.digitalhouse.turnos.exception.VehicleNotFoundException;
import com.digitalhouse.turnos.repository.ReservationRepository;
import com.digitalhouse.turnos.repository.ReviewRepository;
import com.digitalhouse.turnos.repository.UserRepository;
import com.digitalhouse.turnos.repository.VehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
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
    public Review saveRating(ReviewDTO reviewDTO) {

        Vehicle findVehicle = vehicleRepository.findById(reviewDTO.getVehicleId())
                .orElseThrow(() -> new VehicleNotFoundException("Error: Vehículo no encontrado"));

        User findUser = userRepository.getByEmail(reviewDTO.getEmail());

        Review review = new Review(reviewDTO.getComment(), findUser, findVehicle, reviewDTO.getScore());

        return reviewRepository.save(review);

    }

    public List<Review> getAllRatings() {
        return reviewRepository.findAll();
    }

    public double getAverageReviewScore(UUID vehicleId) {
        List<Review> reviewsScore = reviewRepository.getReviewsByVehicleId(vehicleId);

        if (reviewsScore.isEmpty()) return 0.0;

        int totalScore = 0;

        for (Review review : reviewsScore) {
            totalScore += review.getScore();
        }

        double average = (double) totalScore / reviewsScore.size();

        BigDecimal bigDecimal = new BigDecimal(average);
        bigDecimal = bigDecimal.setScale(1, RoundingMode.HALF_UP);

        return bigDecimal.doubleValue();

    }

    public Long getReviewsTotal(UUID vehicleId) {
        return reviewRepository.countByVehicle_Id(vehicleId);
    }

}
