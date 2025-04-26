package com.example.live_backend.service.Experience;

import java.time.LocalDateTime;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.live_backend.model.Activity.Activity;
import com.example.live_backend.model.Experience.ActiveExperience;
import com.example.live_backend.model.Experience.Experience;
import com.example.live_backend.model.User.ActiveExperienceParticipant;
import com.example.live_backend.model.User.User;
import com.example.live_backend.repository.Experience.ActiveExperienceRepository;
import com.example.live_backend.mapper.ActivityMapper;
import com.example.live_backend.dto.Activity.ActivityResponse;
import com.example.live_backend.dto.Experience.ActiveExperienceResponse;
import com.example.live_backend.mapper.ActiveExperienceMapper;
import com.example.live_backend.service.Activity.ActiveActivityService;
import com.example.live_backend.repository.User.ActiveExperienceParticipantRepository;
import com.example.live_backend.dto.CheckInRequest;
import com.example.live_backend.dto.LocationBroadcast;
import com.example.live_backend.service.UserService;
import lombok.RequiredArgsConstructor;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActiveExperienceService {
    // Repositories
    private final ActiveExperienceRepository activeExperienceRepository;
    private final ActiveExperienceParticipantRepository participantRepository;

    // Services
    private final ExperienceService experienceService;
    private final ActiveActivityService activeActivityService;
    private final UserService userService;

    // Mappers
    private final ActivityMapper activityMapper;
    private final ActiveExperienceMapper activeExperienceMapper;

    // Utilities
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Create a new ActiveExperience from an Experience.
     */
    public void startExperience(Long experienceId) {
        Experience experience = experienceService.getExperienceById(experienceId);
        User user = userService.getUserEntityById(experience.getUser().getId());
        ActiveExperience activeExperience = new ActiveExperience();
        activeExperience.setExperience(experience);
        activeExperience.setUser(user);
        activeExperience.setEndTime(experience.getEndDate());
        activeExperienceRepository.save(activeExperience);
    }

    public void endExperience(ActiveExperience activeExperience) {
        activeExperience.setActive(false);
        activeExperience.setEndTime(LocalDateTime.now());
        activeExperienceRepository.save(activeExperience);
    }

    /**
     * Returns the current (ongoing) activity for the active experience
     * as a DTO. If all activities are done or empty, returns null.
     */
    public ActivityResponse getCurrentActivity(Long activeExperienceId) {
        ActiveExperience active = activeExperienceRepository.findById(activeExperienceId)
                .orElseThrow(() -> new RuntimeException("ActiveExperience not found"));

        List<Activity> activities = active.getExperience().getActivities();
        if (activities == null || activities.isEmpty()) {
            return null;
        }

        int index = active.getCurrentActivityIndex();
        if (index >= 0 && index < activities.size()) {
            return activityMapper.toResponse(activities.get(index));
        }
        return null;
    }

    public Activity getCurrentEntitiyActivity(Long activeExperienceId) {
        ActiveExperience activeExperience = activeExperienceRepository.findById(activeExperienceId)
            .orElseThrow(() -> new RuntimeException("ActiveExperience not found"));

        return activeExperience.getExperience().getActivities().get(activeExperience.getCurrentActivityIndex());
    }

    /**
     * Starts the current activity by creating an ActiveActivity
     * linked to the ActiveExperience and the next Activity in the list.
     */
    @Transactional
    public void startActivity(Long activeExperienceId) {
        ActiveExperience activeExperience = activeExperienceRepository.findById(activeExperienceId)
            .orElseThrow(() -> new RuntimeException("ActiveExperience not found"));

        // Get the list of activities from the original Experience
        List<Activity> activities = activeExperience.getExperience().getActivities();
        int currentIndex = activeExperience.getCurrentActivityIndex();

        // Ensure we have an activity to start
        if (currentIndex >= activities.size()) {
            throw new RuntimeException("No more activities to start.");
        }

        Activity activity = activities.get(currentIndex);

        // Pass BOTH the activeExperience and the Activity
        // so we can create an ActiveActivity referencing both
        activeActivityService.startActivity(activeExperience, activity);
    }

    /**
     * Marks the current activity as complete and advances the index.
     * If this was the last activity, sets completed and endTime.
     */
    @Transactional
    public ActiveExperienceResponse completeCurrentActivity(Long activeExperienceId) {
        ActiveExperience activeExperience = activeExperienceRepository.findById(activeExperienceId)
                .orElseThrow(() -> new RuntimeException("ActiveExperience not found"));

        List<Activity> activities = activeExperience.getExperience().getActivities();
        if (activities == null || activities.isEmpty()) {
            endExperience(activeExperience);
            return activeExperienceMapper.toResponse(activeExperience);
        }

        int index = activeExperience.getCurrentActivityIndex();
        if (index < activities.size()) {
            // Move to next
            activeExperience.setCurrentActivityIndex(index + 1);
        } else {
            // No more activities - mark experience done
            activeExperience.setCompleted(true);
            activeExperience.setEndTime(LocalDateTime.now());
        }

        return activeExperienceMapper.toResponse(activeExperienceRepository.save(activeExperience));
    }

    /**
     * Skips the current activity by incrementing the index,
     * optionally marking the experience as done if we skip beyond the last activity.
     */
    @Transactional
    public ActiveExperienceResponse skipActivity(Long activeExperienceId) {
        ActiveExperience active = activeExperienceRepository.findById(activeExperienceId)
                .orElseThrow(() -> new RuntimeException("ActiveExperience not found"));

        int index = active.getCurrentActivityIndex();
        List<Activity> activities = active.getExperience().getActivities();

        active.setCurrentActivityIndex(index + 1);

        if (active.getCurrentActivityIndex() >= activities.size()) {
            active.setCompleted(true);
            active.setEndTime(LocalDateTime.now());
        }

        return activeExperienceMapper.toResponse(activeExperienceRepository.save(active));
    }

    @Transactional
    public void updateUserLocation(Long activeExperienceId, Long userId, Double lat, Double lon) {
        ActiveExperienceParticipant participant = participantRepository
            .findByActiveExperienceIdAndUserId(activeExperienceId, userId)
            .orElseThrow(() -> new RuntimeException("User not in this active experience"));

        User user = participant.getUser();
        if (!user.isShareLocation()) {
            return; 
        }
        
        // Update location
        participant.setLatitude(lat);
        participant.setLongitude(lon);
        participant.setLastLocationUpdate(LocalDateTime.now());

        // Now broadcast a message
        LocationBroadcast payload = new LocationBroadcast(
            participant.getUser().getId(),
            participant.getLatitude(),
            participant.getLongitude(),
            participant.getLastLocationUpdate()
        );

        String destination = "/topic/active-experience/" + activeExperienceId + "/location";
        messagingTemplate.convertAndSend(destination, payload);
    }

    @Scheduled(fixedRate = 60000) // Runs every 1 minute
    public void monitorUpcomingExperiences() {
        List<Experience> upcomingExperiences = experienceService.getUpcomingExperiences();

        for (Experience experience : upcomingExperiences) {
            startExperience(experience.getId());
        }
    }

    public void startActivityByLocation(Long activeExperienceId, CheckInRequest request) {
        Activity activity = getCurrentEntitiyActivity(activeExperienceId);

        double lat = request.getLatitude();
        double lon = request.getLongitude();

        double dist = distance(lat, lon, activity.getLatitude(), activity.getLongitude());
        if (dist <= 40) {
            startActivity(activeExperienceId);
        } else {
            throw new RuntimeException("You are too far from the location!");
        }
    }

    // public void startActivityByUser(StartActivityRequest request) {
    //     Activity activity = activityService.getActivityById(request.getActivityId());
    //     User user = userService.getUserEntityById(request.getUserId());
    //     ActiveExperience activeExperience = activeExperienceRepository.findById(request.getActiveExperienceId())
    //         .orElseThrow(() -> new RuntimeException("ActiveExperience not found"));
    // }

    private double distance(double lat1, double lon1, double lat2, double lon2) {
        // Earth radius in meters
        double R = 6371e3;
        double phi1 = Math.toRadians(lat1);
        double phi2 = Math.toRadians(lat2);
        double deltaPhi = Math.toRadians(lat2 - lat1);
        double deltaLambda = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        double dist = R * c;
        return dist;
    }
}
