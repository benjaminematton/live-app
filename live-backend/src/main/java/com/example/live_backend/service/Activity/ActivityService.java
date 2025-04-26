package com.example.live_backend.service.Activity;

import org.springframework.stereotype.Service;
import com.example.live_backend.repository.Activity.ActivityRepository;
import lombok.RequiredArgsConstructor;
import com.example.live_backend.dto.Activity.ActivityRequest;
import com.example.live_backend.dto.Activity.ActivityResponse;
import com.example.live_backend.mapper.ActivityMapper;
import com.example.live_backend.model.Activity.Activity;

@Service
@RequiredArgsConstructor
public class ActivityService {
    private final ActivityRepository activityRepository;
    private final ActivityMapper activityMapper;
    
    public ActivityResponse createActivity(ActivityRequest request) {
        Activity activity = activityMapper.toEntity(request);
        activityRepository.save(activity);
        return activityMapper.toResponse(activity);
    }
}
