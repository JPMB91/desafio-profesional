package com.digitalhouse.turnos.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class ReviewDTO {

    private int score;

    private String comment;

    @NotNull
    private UUID userId;

    @NotNull
    private UUID vehicleId;


    public ReviewDTO(int score, String comment, UUID userId, UUID vehicleId) {
        this.score = score;
        this.comment = comment;
        this.userId = userId;
        this.vehicleId = vehicleId;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public UUID getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(UUID vehicleId) {
        this.vehicleId = vehicleId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
