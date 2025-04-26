package com.example.live_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import com.example.live_backend.dto.Google.GooglePlaceDetailsResponse;
import com.example.live_backend.dto.Google.GoogleReverseGeocodeResponse;

import org.springframework.beans.factory.annotation.Value;

@Service
public class GoogleAPIService {
    @Value("${google.api.key}") // or however you store your key
    private String googleApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    // 1) Reverse Geocoding
    public GoogleReverseGeocodeResponse reverseGeocode(double lat, double lng) {
        String url = String.format(
            "https://maps.googleapis.com/maps/api/geocode/json?latlng=%f,%f&key=%s",
            lat, lng, googleApiKey
        );

        ResponseEntity<GoogleReverseGeocodeResponse> response =
                restTemplate.getForEntity(url, GoogleReverseGeocodeResponse.class);

        return response.getBody();
    }

    // 2) Place Details
    public GooglePlaceDetailsResponse getPlaceDetails(String placeId) {
        String url = String.format(
            "https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&key=%s",
            placeId, googleApiKey
        );

        ResponseEntity<GooglePlaceDetailsResponse> response =
                restTemplate.getForEntity(url, GooglePlaceDetailsResponse.class);

        return response.getBody();
    }
}
