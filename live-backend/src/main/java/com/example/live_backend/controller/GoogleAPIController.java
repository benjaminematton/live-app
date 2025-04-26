package com.example.live_backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.live_backend.dto.Google.GooglePlaceDetailsResponse;
import com.example.live_backend.dto.Google.GoogleReverseGeocodeResponse;
import com.example.live_backend.service.GoogleAPIService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/google-places")
@RequiredArgsConstructor
public class GoogleAPIController {
    
    private final GoogleAPIService googleAPIService;

    /**
     * Reverse Geocode endpoint:
     * e.g. GET /api/google-places/reverse-geocode?lat=40.7128&lng=-74.0060
     */
    @GetMapping("/reverse-geocode")
    public ResponseEntity<GoogleReverseGeocodeResponse> reverseGeocode(
            @RequestParam double lat,
            @RequestParam double lng) {

        GoogleReverseGeocodeResponse response = googleAPIService.reverseGeocode(lat, lng);
        return ResponseEntity.ok(response);
    }

    /**
     * Place Details endpoint:
     * e.g. GET /api/google-places/place-details?placeId=ChIJrTLr-GyuEmsRBfy61i59si0
     */
    @GetMapping("/place-details")
    public ResponseEntity<GooglePlaceDetailsResponse> getPlaceDetails(
            @RequestParam String placeId) {

        GooglePlaceDetailsResponse response = googleAPIService.getPlaceDetails(placeId);
        return ResponseEntity.ok(response);
    }
}
