package com.example.live_backend.dto.Google;

import lombok.Data;

import java.util.List;

@Data
public class GoogleReverseGeocodeResponse {

    private List<GoogleResult> results;
    private String status;

    @Data
    public static class GoogleResult {
        private String formatted_address;
        private List<AddressComponent> address_components;
        // ... other fields from the JSON if needed
    }

    @Data
    public static class AddressComponent {
        private String long_name;
        private String short_name;
        private List<String> types;
    }
}
