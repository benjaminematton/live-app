package com.example.live_backend.service.Activity;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import com.example.live_backend.model.Activity.ActiveActivity;
import com.example.live_backend.model.Activity.Activity;
import com.example.live_backend.model.Experience.ActiveExperience;
import com.example.live_backend.repository.Activity.ActiveActivityRepository;
import com.example.live_backend.dto.Activity.ActiveActivityResponse;
import com.example.live_backend.mapper.ActiveActivityMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ActiveActivityService {
    private final ActiveActivityRepository activeActivityRepository;
    private final ActiveActivityMapper activeActivityMapper;

    @Transactional
    public ActiveActivityResponse startActivity(ActiveExperience activeExperience, Activity activity) {
        // Create the ActiveActivity
        ActiveActivity activeActivity = new ActiveActivity();
        activeActivity.setActiveExperience(activeExperience);
        activeActivity.setActivity(activity);

        activeActivity.setStartTime(LocalDateTime.now());
        activeActivity.setPhotoPromptTime(generateRandomPromptTime(LocalDateTime.now()));

        activeActivityRepository.save(activeActivity);
        return activeActivityMapper.toResponse(activeActivity);
    }

    @Transactional
    public void submitActivityPhoto(Long activeActivityId, String photoUrl) {
        ActiveActivity aa = activeActivityRepository.findById(activeActivityId)
            .orElseThrow(() -> new RuntimeException("ActiveActivity not found"));

        aa.setPhotoUrl(photoUrl);
        aa.setPhotoSubmitted(true);
        activeActivityRepository.save(aa);
    }

    private LocalDateTime generateRandomPromptTime(LocalDateTime activityStartTime) {
        // The random prompt is between activityStartTime and 20 mins after
        LocalDateTime maxTime = activityStartTime.plusMinutes(20);

        long startMillis = activityStartTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
        long endMillis = maxTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();

        long randomMillis = ThreadLocalRandom.current().nextLong(startMillis, endMillis);
        return Instant.ofEpochMilli(randomMillis)
            .atZone(ZoneId.systemDefault())
            .toLocalDateTime();
    }
}
