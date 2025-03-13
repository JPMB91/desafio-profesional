package com.digitalhouse.turnos.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class ReviewDTO {

    @Min(1)
    @Max(5)
    private int score;

    private String comment;

    @NotNull
    private String email;

    @NotNull
    private UUID vehicleId;

    public ReviewDTO(int score, UUID vehicleId, String email, String comment) {
        this.score = score;
        this.vehicleId = vehicleId;
        this.email = email;
        this.comment = comment;
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



    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(@NotNull String email) {
        this.email = email;
    }

}
