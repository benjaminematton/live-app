package com.example.live_backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.live_backend.dto.Activity.ActivityResponse;
import com.example.live_backend.service.chatGPT.ChatGPTService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
public class AssitantController {

    private final ChatGPTService chatGPTService;

    @PostMapping("/recommendations")
    public List<ActivityResponse> recommendActivities(@RequestBody Map<String, String> payload) {
        System.out.println("Received request for activity: " + payload); // Debug log
        try {
            String chosenActivity = payload.get("chosenActivity");
            System.out.println("Received request for activity: " + chosenActivity); // Debug log
            return chatGPTService.recommendActivities(chosenActivity);
        } catch (Exception e) {
            System.err.println("Error in recommendation controller: " + e.getMessage()); // Debug log
            e.printStackTrace(); // Print full stack trace
            throw e;
        }
    }


}
