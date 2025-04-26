package com.example.live_backend.mapper;

import com.example.live_backend.dto.Activity.ActivityDefinitionRequest;
import com.example.live_backend.dto.Activity.ActivityDefinitionResponse;
import com.example.live_backend.model.Activity.ActivityDefinition;

import org.springframework.stereotype.Component;

@Component
public class ActivityDefinitionMapper {
    
    public ActivityDefinitionResponse toResponse(ActivityDefinition activity) {
        ActivityDefinitionResponse response = new ActivityDefinitionResponse();
        response.setId(activity.getId());
        response.setTitle(activity.getTitle());
        response.setLocation(activity.getLocation());
        return response;
    }
    
    public ActivityDefinition toEntity(ActivityDefinitionRequest request) {
        ActivityDefinition activity = new ActivityDefinition();
        activity.setTitle(request.getTitle());
        activity.setLocation(request.getLocation());
        return activity;
    }
    
    public ActivityDefinition updateEntity(ActivityDefinition activity, ActivityDefinitionRequest request) {
        activity.setTitle(request.getTitle());
        activity.setLocation(request.getLocation());
        return activity;
    }
}
