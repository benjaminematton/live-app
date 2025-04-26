package com.example.live_backend.controller;

import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import com.example.live_backend.service.Activity.ActivityService;
import com.example.live_backend.dto.Activity.ActivityResponse;
import com.example.live_backend.dto.Activity.ActivityRequest;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequiredArgsConstructor
public class ActivityController {
    private final ActivityService activityService;

    @PostMapping("/activities")
    public ResponseEntity <ActivityResponse> createActivity(@RequestBody ActivityRequest request) {
        return ResponseEntity.ok(activityService.createActivity(request));
    }
}
