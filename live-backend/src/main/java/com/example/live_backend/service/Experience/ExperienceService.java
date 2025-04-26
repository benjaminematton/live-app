package com.example.live_backend.service.Experience;

import com.example.live_backend.dto.Activity.ActivityResponse;
import com.example.live_backend.dto.Experience.ExperienceRequest;
import com.example.live_backend.dto.Experience.ExperienceResponse;
import com.example.live_backend.model.Activity.Activity;
import com.example.live_backend.model.Experience.Experience;
import com.example.live_backend.model.Experience.ExperienceVisibility;
import com.example.live_backend.model.User.User;
import com.example.live_backend.repository.Experience.ExperienceRepository; 

import java.time.LocalDateTime;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.live_backend.mapper.ActivityMapper;
import com.example.live_backend.mapper.ExperienceMapper;
import com.example.live_backend.service.UserService;
import com.example.live_backend.service.chatGPT.ChatGPTService;

import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class ExperienceService {

    private final ExperienceRepository experienceRepository;
    private final ActivityMapper activityMapper;
    private final ExperienceMapper experienceMapper;
    private final ChatGPTService chatGPTService;
    private final UserService userService;

    @Transactional
    public ExperienceResponse createExperience(Long userId, ExperienceRequest request) {
        User user = userService.getUserEntityById(userId);

        Experience experience = experienceMapper.toEntity(request);
        experience.setUser(user);

        Experience savedExperience = experienceRepository.save(experience);

        if (request.getActivities() != null && !request.getActivities().isEmpty()) {
            List<Activity> activities = request.getActivities().stream()
                    .map(activityMapper::toEntity)
                    .collect(Collectors.toList());
            savedExperience.setActivities(activities);
        }

        return experienceMapper.toResponse(savedExperience);
    }

    public List<ExperienceResponse> getUserExperiences(Long userId) {
        List<Experience> experiences = experienceRepository.findByUserIdOrderByStartDateDesc(userId);
        return experiences.stream()
                .map(experienceMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ExperienceResponse getExperienceById(Long experienceId, Long userId) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new RuntimeException("Experience not found"));

        User user = userService.getUserEntityById(userId);

        // Check if user is the owner
        if (experience.getUser().getId().equals(user.getId())) {
            return experienceMapper.toResponse(experience);
        }
        // Check if schedule is public
        if (experience.getVisibility() == ExperienceVisibility.PUBLIC) {
            return experienceMapper.toResponse(experience);
        }

        throw new RuntimeException("Unauthorized access to experience");
    }

    public Experience getExperienceEntityById(Long experienceId, Long userId) {
        Experience experience = experienceRepository.findById(experienceId)
                .orElseThrow(() -> new RuntimeException("Experience not found"));
        return experience;
    }


    @Transactional
    public ExperienceResponse updateExperience(Long experienceId, Long userId, ExperienceRequest request) {
        Experience experience = getExperienceEntityById(experienceId, userId);   

        experienceMapper.updateEntity(experience, request);

        // Clear existing activities and add new ones
        experience.getActivities().clear();
        if (request.getActivities() != null) {
            List<Activity> activities = request.getActivities().stream()
                    .map(activityMapper::toEntity)
                    .collect(Collectors.toList());
            experience.getActivities().addAll(activities);
        }

        return experienceMapper.toResponse(experienceRepository.save(experience));
    }

    @Transactional
    public void deleteExperience(Long experienceId, Long userId) {
        Experience experience = getExperienceEntityById(experienceId, userId);
        experienceRepository.delete(experience);
    }

    public List<ActivityResponse> getExperienceActivities(Long experienceId, Long userId) {
        Experience experience = getExperienceEntityById(experienceId, userId);
        return experience.getActivities().stream()
                .map(activityMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteActivity(Long experienceId, Long activityId, Long userId) {
        Experience experience = getExperienceEntityById(experienceId, userId);
        Activity activity = experience.getActivities().stream()
                .filter(a -> a.getId().equals(activityId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        experience.getActivities().remove(activity);
        
    }

    public List<ActivityResponse> generateActivities(Long experienceId, String prompt, Long userId) {
        Experience experience = getExperienceEntityById(experienceId, userId);
        User user = userService.getUserEntityById(userId);
        return chatGPTService.generateActivitiesSuggestions(prompt, experience.getStartDate(), experience.getEndDate(), user.getLocation());
    }

    public List<ActivityResponse> refineExperience(Long experienceId, Long userId, String refinementPrompt) {
        Experience experience = getExperienceEntityById(experienceId, userId);
        List<Activity> activities = experience.getActivities();
        return chatGPTService.refineExperience(activities, refinementPrompt);
    }

    public Experience getExperienceById(Long experienceId) {
        return experienceRepository.findById(experienceId).orElse(null);
    }

    public List<Experience> getUpcomingExperiences() {
        return experienceRepository.findUpcomingExperiences(LocalDateTime.now(), LocalDateTime.now().plusMinutes(20));
    }

    public List<ExperienceResponse> getUserUpcomingExperiences(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        List<Experience> upcomingExperiences = experienceRepository.findAllFutureExperiences(now);
        return upcomingExperiences.stream()
            .map(experienceMapper::toResponse)
            .collect(Collectors.toList());
    }
} 