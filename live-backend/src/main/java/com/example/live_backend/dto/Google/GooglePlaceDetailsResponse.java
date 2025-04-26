package com.example.live_backend.dto.Google;

import lombok.Data;

@Data
public class GooglePlaceDetailsResponse {
    private Result result;
    private String status;

    @Data
    public static class Result {
        private String name;
        private String formatted_address;
        private double rating; // for example
        private Geometry geometry;
        // ... other fields from Google Place Details
    }

    @Data
    public static class Geometry {
        private Location location;
    }

    @Data
    public static class Location {
        private double lat;
        private double lng;
    }
}
