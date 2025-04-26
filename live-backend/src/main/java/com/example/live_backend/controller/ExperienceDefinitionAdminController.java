package com.example.live_backend.controller;

import com.example.live_backend.service.Experience.ExperienceDefinitionService;
import com.example.live_backend.dto.Experience.ExperienceDefinitionResponse;
import com.example.live_backend.dto.Experience.ExperienceDefinitionRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/experience-definitions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')") // Ensure only admin can call these
public class ExperienceDefinitionAdminController {

    private final ExperienceDefinitionService definitionService;

    @PostMapping
    public ResponseEntity<ExperienceDefinitionResponse> createDefinition(
            @RequestBody ExperienceDefinitionRequest request) {
        ExperienceDefinitionResponse response = definitionService.createExperienceDefinition(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExperienceDefinitionResponse> updateDefinition(
            @PathVariable Long id,
            @RequestBody ExperienceDefinitionRequest request) {
        ExperienceDefinitionResponse response = definitionService.updateExperienceDefinition(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExperienceDefinitionResponse> getOne(@PathVariable Long id) {
        ExperienceDefinitionResponse response = definitionService.getExperienceDefinition(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ExperienceDefinitionResponse>> getAll() {
        List<ExperienceDefinitionResponse> response = definitionService.findAll();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDefinition(@PathVariable Long id) {
        definitionService.deleteExperienceDefinition(id);
        return ResponseEntity.noContent().build();
    }
}
