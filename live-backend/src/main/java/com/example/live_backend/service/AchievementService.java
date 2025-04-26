package com.example.live_backend.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.live_backend.model.Achievement;
import com.example.live_backend.model.User.User;
import com.example.live_backend.model.User.UserAchievement;
import com.example.live_backend.repository.AchievementRepository;
import com.example.live_backend.repository.User.UserAchievementRepository;
import com.example.live_backend.dto.Achivement.AchievementResponse;
import com.example.live_backend.dto.User.UserAchievementResponse;

import java.util.List;
import java.util.stream.Collectors;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AchievementService {

    private final AchievementRepository achievementRepository;
    private final UserAchievementRepository userAchievementRepository;
    private final UserService userService;

    public void onPostCreated(User user) {
        // 1) Check if user has posted for the first time => "FIRST_POST"
        // 2) Check if user has posted N times => "SERIAL_POSTER" or so
        // 3) If user qualifies, create a UserAchievement record
        awardAchievementIfEligible(user, "FIRST_POST");
        awardAchievementIfEligible(user, "10_POSTS");
        awardAchievementIfEligible(user, "25_POSTS");
        awardAchievementIfEligible(user, "50_POSTS");
        awardAchievementIfEligible(user, "100_POSTS");
        // ...
    }

    public void onPlaceVisited(User user, String placeId) {
        // Check if user has visited N unique places => "EXPLORER" 
        // Use the user's visit history to see how many unique places they've visited
        // If threshold is met, award it
        awardAchievementIfEligible(user, "3_PLACES");
        awardAchievementIfEligible(user, "10_PLACES");
        awardAchievementIfEligible(user, "25_PLACES");
        awardAchievementIfEligible(user, "50_PLACES");
        awardAchievementIfEligible(user, "100_PLACES");
        awardAchievementIfEligible(user, "NEW_CITY");
        // ...
    }

    // Generic method to award a single known achievement code
    private void awardAchievementIfEligible(User user, String achievementCode) {
        // 1) Find achievement definition by code
        Achievement achievement = achievementRepository.findByCode(achievementCode)
            .orElseThrow(() -> new IllegalArgumentException("Achievement not found"));

        // 2) Check if user already has it (unless your system allows multiple awards)
        boolean alreadyEarned = userAchievementRepository.existsByUserAndAchievement(user, achievement);
        if (alreadyEarned) {
            return; // user already has it
        }

        // 3) If not, check conditions 
        // (In a simple approach, you do this logic here, 
        //  or you might do it before calling this method.)

        // 4) Award it
        UserAchievement userAchievement = new UserAchievement();
        userAchievement.setUser(user);
        userAchievement.setAchievement(achievement);
        userAchievement.setDateEarned(LocalDateTime.now());
        userAchievementRepository.save(userAchievement);

        // Optionally, notify user via push/email/etc.
    }

    public List<AchievementResponse> findAll() {
        return achievementRepository.findAll().stream()
            .map(achievement -> {
                AchievementResponse response = new AchievementResponse();
                response.setId(achievement.getId());
                response.setName(achievement.getName());
                response.setDescription(achievement.getDescription());
                response.setCode(achievement.getCode());
                response.setIconUrl(achievement.getIconUrl());
                response.setPoints(achievement.getPoints());
                return response;
            })
            .collect(Collectors.toList());
    }

    public List<UserAchievementResponse> getUserAchievements(Long userId) {
        User user = userService.getUserEntityById(userId);

        return userAchievementRepository.findAllByUser(user).stream()
            .map(userAchievement -> {
                UserAchievementResponse response = new UserAchievementResponse();
                response.setId(userAchievement.getId());
                response.setUserId(user.getId());
                
                AchievementResponse achievementResponse = new AchievementResponse();
                achievementResponse.setId(userAchievement.getAchievement().getId());
                achievementResponse.setName(userAchievement.getAchievement().getName());
                achievementResponse.setDescription(userAchievement.getAchievement().getDescription());
                achievementResponse.setCode(userAchievement.getAchievement().getCode());
                
                response.setAchievement(achievementResponse);
                response.setDateEarned(userAchievement.getDateEarned());
                response.setPoints(userAchievement.getAchievement().getPoints());
                return response;
            })
            .collect(Collectors.toList());
    }
}
