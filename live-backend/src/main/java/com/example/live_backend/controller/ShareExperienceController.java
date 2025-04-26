package com.example.live_backend.controller;

import com.example.live_backend.dto.Experience.ShareExperienceRequest;
import com.example.live_backend.dto.Experience.ShareExperienceResponse;
import com.example.live_backend.security.CustomUserDetails;
import com.example.live_backend.service.Experience.ShareExperienceService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/experiences/{experienceId}/shares")
@RequiredArgsConstructor
public class ShareExperienceController {

    private final ShareExperienceService shareExperienceService;

    @PostMapping("/{experienceId}/share")
    public ResponseEntity<Void> shareExperience(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long experienceId,
            @Valid @RequestBody ShareExperienceRequest request) {
        shareExperienceService.shareExperience(experienceId, userDetails.getUserId(), request);   
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{experienceId}/share/{username}")
    public ResponseEntity<Void> unshareExperience(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long experienceId,
            @PathVariable Long userId) {
        shareExperienceService.unshareExperience(experienceId, userDetails.getUserId(), userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/shared")
    public ResponseEntity<List<ShareExperienceResponse>> getSharedExperiences(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(shareExperienceService.getSharedExperiences(userDetails.getUserId()));
    }

    @PostMapping("/{shareId}/accept")
    public ResponseEntity<ShareExperienceResponse> acceptShare(
        @PathVariable Long shareId,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        ShareExperienceResponse resp = shareExperienceService.acceptShare(shareId, userDetails.getUser().getId());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/{shareId}/decline")
    public ResponseEntity<ShareExperienceResponse> declineShare(
        @PathVariable Long shareId,
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        ShareExperienceResponse resp = shareExperienceService.declineShare(shareId, userDetails.getUser().getId());
        return ResponseEntity.ok(resp);
    }
}
