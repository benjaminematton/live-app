package com.example.live_backend.dto.Experience;

import com.example.live_backend.dto.Activity.ActivityDefinitionRequest;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

import lombok.Data;

@Data
public class ExperienceDefinitionRequest {
    private String title;

    @NotEmpty(message = "An experience must have at least one activity.")   
    private List<ActivityDefinitionRequest> activities;
}
