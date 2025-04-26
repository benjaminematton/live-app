package com.example.live_backend.mapper;

import org.springframework.stereotype.Component;

import com.example.live_backend.dto.Experience.ExperienceDefinitionRequest;
import com.example.live_backend.dto.Experience.ExperienceDefinitionResponse;
import com.example.live_backend.model.Experience.ExperienceDefinition;

@Component
public class ExperienceDefinitionMapper {
    
    public ExperienceDefinitionResponse toResponse(ExperienceDefinition experienceDefinition) {
        ExperienceDefinitionResponse response = new ExperienceDefinitionResponse();
        response.setId(experienceDefinition.getId());
        response.setTitle(experienceDefinition.getTitle());
        return response;
    }

    public ExperienceDefinition toEntity(ExperienceDefinitionRequest request) {
        ExperienceDefinition experienceDefinition = new ExperienceDefinition();
        experienceDefinition.setTitle(request.getTitle());
        return experienceDefinition;
    }
}
