package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.dto.ReviewDTO;
import com.digitalhouse.turnos.dto.ReviewResponseDTO;
import com.digitalhouse.turnos.dto.ReviewStatsDTO;
import com.digitalhouse.turnos.entity.Review;
import com.digitalhouse.turnos.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody @Valid ReviewDTO reviewDTO) {
        ReviewResponseDTO savedReview = reviewService.saveReview(reviewDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }


    @GetMapping("/{vehicleId}")
    public ResponseEntity<?> getAverageScore(@PathVariable("vehicleId") UUID vehicleId){

        ReviewStatsDTO avgScore = reviewService.getVehicleReviewStats(vehicleId);

        return ResponseEntity.ok().body(avgScore);
    }


    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<ReviewResponseDTO>> getAllReviewsByVehicleId(@PathVariable("vehicleId") UUID vehicleId) {
        return ResponseEntity.ok().body(reviewService.getAllReviewsByVehicleId(vehicleId));
    }

}
