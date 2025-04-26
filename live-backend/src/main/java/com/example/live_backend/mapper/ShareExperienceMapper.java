package com.example.live_backend.mapper;

import org.springframework.stereotype.Component;

import com.example.live_backend.dto.Experience.ShareExperienceResponse;
import com.example.live_backend.model.Experience.Experience;
import com.example.live_backend.model.Experience.ShareExperience;
import com.example.live_backend.model.User.User;

@Component
public class ShareExperienceMapper {

    public ShareExperience toEntity(Experience experience, User sharedWith) {
        ShareExperience share = new ShareExperience();
        share.setExperience(experience);
        share.setSharedWith(sharedWith);
        return share;
    }

    public ShareExperienceResponse toResponse(ShareExperience share) {
        ShareExperienceResponse response = new ShareExperienceResponse();
        response.setExperienceId(share.getExperience().getId());
        response.setSharedWithUserId(share.getSharedWith().getId());
        response.setSharedAt(share.getSharedAt());
        return response;
    }
}
