package com.example.live_backend.dto.User;

import lombok.Data;

@Data
public class UserProfileResponse {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private Boolean shareLocation;
    private Boolean getNotifications;
    private String location;
}
