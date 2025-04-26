package com.example.live_backend.dto.Experience;

import lombok.Data;

@Data
public class ExperienceDefinitionResponse {
    private Long id;
    private String title;

    // If you want to show the stored rating/popularity
    private double averageRating;
    private int totalRatings;
    private int popularity;
}
