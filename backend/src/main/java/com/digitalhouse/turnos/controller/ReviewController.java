package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.dto.ReviewDTO;
import com.digitalhouse.turnos.entity.Review;
import com.digitalhouse.turnos.service.ReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    Logger logger = LoggerFactory.getLogger(ReviewController.class);

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<?> createReview(
                                          @RequestBody ReviewDTO reviewDTO) {

        try {
            Review savedReview = reviewService.saveRating(reviewDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);

        } catch (Exception e) {
            logger.error("Error creando reseña{}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creando reseña");

        }

    }

    @GetMapping("/{vehicleId}")
    public ResponseEntity<?> getAverageScore(@PathVariable("vehicleId") UUID vehicleId){

        Double avgScore = reviewService.getAverageReviewScore(vehicleId);

        return ResponseEntity.ok().body(avgScore);
    }


    @GetMapping("/count/{vehicleId}")
    public ResponseEntity<Long> getReviewsCount(@PathVariable("vehicleId") UUID vehicleId){

        return ResponseEntity.ok().body(reviewService.getReviewsTotal(vehicleId));
    }


}
