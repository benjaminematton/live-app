package com.example.live_backend.dto.Experience;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ShareExperienceResponse {
    private Long id;
    private Long experienceId;    
    private Long sharedWithUserId;
    private LocalDateTime sharedAt;
}
