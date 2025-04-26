package com.example.live_backend.mapper;

import com.example.live_backend.dto.Experience.ExperienceRequest;
import com.example.live_backend.dto.Experience.ExperienceResponse;
import com.example.live_backend.model.Experience.Experience;

import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ExperienceMapper {

    private ActivityMapper activityMapper;

    public Experience toEntity(ExperienceRequest request) {
        Experience experience = new Experience();
        experience.setTitle(request.getTitle());
        experience.setStartDate(request.getStartDate());
        experience.setVisibility(request.getVisibility());
        if (request.getActivities() != null) {
            experience.setActivities(
                request.getActivities().stream()
                    .map(activityMapper::toEntity)
                    .collect(Collectors.toList())
            );
        }
        experience.setPhotoUrl(request.getPhoto());
        
        return experience;
    }

    public ExperienceResponse toResponse(Experience experience) {
        ExperienceResponse response = new ExperienceResponse();
        response.setId(experience.getId());
        response.setTitle(experience.getTitle());
        response.setStartDate(experience.getStartDate());
        response.setVisibility(experience.getVisibility());
        response.setCreatedAt(experience.getCreatedAt());
        response.setUpdatedAt(experience.getUpdatedAt());
        response.setPhotoUrl(experience.getPhotoUrl());
        
        if (experience.getActivities() != null) {
            response.setActivities(
                experience.getActivities().stream()
                    .map(activityMapper::toResponse)
                    .collect(Collectors.toList())
            );
        }
        
        return response;
    }

    public void updateEntity(Experience experience, ExperienceRequest request) {
        experience.setTitle(request.getTitle());
        experience.setStartDate(request.getStartDate());
        experience.setVisibility(request.getVisibility());
    }
} 