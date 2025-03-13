package com.digitalhouse.turnos.dto;

public class ReviewStatsDTO {

    private double averageScore;
    private Long reviewCount;

    public ReviewStatsDTO(double averageScore, Long reviewCount) {
        this.averageScore = averageScore;
        this.reviewCount = reviewCount;
    }


    public double getAverageScore() {
        return averageScore;
    }

    public Long getReviewCount() {
        return reviewCount;
    }

}
