package com.example.live_backend.service.Activity;
import com.example.live_backend.dto.Activity.ActivityDefinitionRequest;
import com.example.live_backend.dto.Activity.ActivityDefinitionResponse;
import com.example.live_backend.mapper.ActivityDefinitionMapper;
import com.example.live_backend.model.Activity.ActivityDefinition;
import com.example.live_backend.repository.Activity.ActivityDefinitionRepository;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityDefinitionService {
    private final ActivityDefinitionRepository activityDefinitionRepository;
    private final ActivityDefinitionMapper activityDefinitionMapper;

    public ActivityDefinitionResponse getActivityDefinition(String activityName) {
        ActivityDefinition activityDefinition = activityDefinitionRepository.findByTitle(activityName);
        return activityDefinitionMapper.toResponse(activityDefinition);
    }

    public ActivityDefinitionResponse getActivityDefinition(String activityName, String location) {
        ActivityDefinition activityDefinition = activityDefinitionRepository.findByTitleAndLocation(activityName, location);
        return activityDefinitionMapper.toResponse(activityDefinition);
    }

    public ActivityDefinitionResponse createActivityDefinition(ActivityDefinitionRequest request) {
        ActivityDefinition activityDefinition = activityDefinitionMapper.toEntity(request);
        activityDefinitionRepository.save(activityDefinition);
        return activityDefinitionMapper.toResponse(activityDefinition);
    }

    public ActivityDefinitionResponse updateActivityDefinition(Long id, ActivityDefinitionRequest request) {
        ActivityDefinition activityDefinition = activityDefinitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ActivityDefinition not found"));
        activityDefinitionMapper.updateEntity(activityDefinition, request);
        activityDefinitionRepository.save(activityDefinition);
        return activityDefinitionMapper.toResponse(activityDefinition);
    }

    public List<ActivityDefinitionResponse> findAll() {
        return activityDefinitionRepository.findAll().stream()
                .map(activityDefinitionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public void deleteActivityDefinition(Long id) {
        activityDefinitionRepository.deleteById(id);
    }

    public ActivityDefinitionResponse getActivityDefinition(Long id) {
        return activityDefinitionMapper.toResponse(activityDefinitionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ActivityDefinition not found")));
    }
}
