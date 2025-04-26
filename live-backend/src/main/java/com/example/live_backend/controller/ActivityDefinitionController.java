package com.example.live_backend.controller;

import com.example.live_backend.dto.Activity.ActivityDefinitionRequest;
import com.example.live_backend.dto.Activity.ActivityDefinitionResponse;
import com.example.live_backend.service.Activity.ActivityDefinitionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/activityDefinitions")
@RequiredArgsConstructor
public class ActivityDefinitionController {

    private final ActivityDefinitionService activityDefinitionService;

    @GetMapping
    public List<ActivityDefinitionResponse> getAllActivities() {
        return activityDefinitionService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ActivityDefinitionResponse> getActivityDefinitionById(@PathVariable Long id) {
        return ResponseEntity.ok(activityDefinitionService.getActivityDefinition(id));
    }

    @PostMapping
    public ActivityDefinitionResponse createActivityDefinition(@Valid @RequestBody ActivityDefinitionRequest request) {
        return activityDefinitionService.createActivityDefinition(request);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityDefinitionResponse> updateActivityDefinition(
            @PathVariable Long id,
            @Valid @RequestBody ActivityDefinitionRequest request) {
        return ResponseEntity.ok(activityDefinitionService.updateActivityDefinition(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivityDefinition(@PathVariable Long id) {
        activityDefinitionService.deleteActivityDefinition(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search/title/{title}")
    public ActivityDefinitionResponse findByTitle(@PathVariable String title) {
        return activityDefinitionService.getActivityDefinition(title);
    }

    // Search activities by title and location
    @GetMapping("/search")
    public ActivityDefinitionResponse findByTitleAndLocation(
            @RequestParam String title,
            @RequestParam String location) {
        return activityDefinitionService.getActivityDefinition(title, location);
    }
} 