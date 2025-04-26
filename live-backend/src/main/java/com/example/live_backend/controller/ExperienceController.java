package com.example.live_backend.controller;

import com.example.live_backend.security.CustomUserDetails;
import com.example.live_backend.service.Experience.ExperienceService;
import com.example.live_backend.service.chatGPT.ChatGPTService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import com.example.live_backend.dto.Activity.ActivityResponse;
import com.example.live_backend.dto.Experience.ExperienceRequest;
import com.example.live_backend.dto.Experience.ExperienceResponse;

@RestController
@RequestMapping("/api/experiences")
@RequiredArgsConstructor
public class ExperienceController {

    private final ExperienceService experienceService;
    private final ChatGPTService chatGPTService;

    @PostMapping
    public ResponseEntity<ExperienceResponse> createExperience(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ExperienceRequest request) {
        return ResponseEntity.ok(experienceService.createExperience(userDetails.getUserId(), request));
    }

    @GetMapping
    public ResponseEntity<List<ExperienceResponse>> getUserExperiences(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(experienceService.getUserExperiences(userDetails.getUserId()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<ExperienceResponse>> getUserUpcomingExperiences(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(experienceService.getUserUpcomingExperiences(userDetails.getUserId()));
    }

    @GetMapping("/{scheduleId}")
    public ResponseEntity<ExperienceResponse> getExperienceById(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long experienceId) {
        return ResponseEntity.ok(experienceService.getExperienceById(experienceId, userDetails.getUserId()));    
    }

    @PutMapping("/{scheduleId}")
    public ResponseEntity<ExperienceResponse> updateExperience(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long experienceId,
            @Valid @RequestBody ExperienceRequest request) {
        return ResponseEntity.ok(experienceService.updateExperience(experienceId, userDetails.getUserId(), request));
    }

    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<Void> deleteExperience(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long experienceId) {
        experienceService.deleteExperience(experienceId, userDetails.getUserId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{experienceId}/activities")
    public ResponseEntity<List<ActivityResponse>> getExperienceActivities(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long experienceId) {
        return ResponseEntity.ok(experienceService.getExperienceActivities(experienceId, userDetails.getUserId()));   
    }

    @DeleteMapping("/{experienceId}/activities/{activityId}")
    public ResponseEntity<Void> deleteActivity(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long experienceId,
            @PathVariable Long activityId) {
        experienceService.deleteActivity(experienceId, activityId, userDetails.getUserId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/suggest")
    public ResponseEntity<List<ActivityResponse>> suggestActivities(     
            @RequestParam String prompt,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            @RequestParam String location) {
        List<ActivityResponse> suggestions = chatGPTService.generateActivitiesSuggestions(prompt, startDate, endDate, location);
        return ResponseEntity.ok(suggestions);
    }

    @PostMapping("/{scheduleId}/refine")
    public ResponseEntity<List<ActivityResponse>> refineSchedule(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long experienceId,
            @RequestParam String refinementPrompt) {
        return ResponseEntity.ok(experienceService.refineExperience(experienceId, userDetails.getUserId(), refinementPrompt));
    }

    @PostMapping("/{scheduleId}/generate")
    public ResponseEntity<List<ActivityResponse>> generateActivities(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long experienceId,
            @RequestParam String prompt) {
        return ResponseEntity.ok(experienceService.generateActivities(experienceId, prompt, userDetails.getUserId()));
    }
} 