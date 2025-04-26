package com.example.live_backend.dto.User;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String username;
    private String fullName;
    private String profilePicture;
}