package com.example.live_backend.dto.User;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdatePasswordRequest {
    @NotBlank
    private String currentPassword;  // Verify identity

    @NotBlank
    private String newPassword;
}
