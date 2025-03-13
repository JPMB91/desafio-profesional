package com.digitalhouse.turnos.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class ReviewResponseDTO {
    private Long reviewId;
    private UUID vehicleId;
    private String comment;
    private LocalDateTime createdAt;
    private String userName;
    private int score;

    public ReviewResponseDTO( Long reviewId,UUID vehicleId, String comment, LocalDateTime createdAt,
                                 String userName, int score) {
        this.reviewId = reviewId;
        this.vehicleId = vehicleId;
        this.comment = comment;
        this.createdAt = createdAt;
        this.userName = userName;
        this.score = score;
    }

    public UUID getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(UUID vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }


    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
