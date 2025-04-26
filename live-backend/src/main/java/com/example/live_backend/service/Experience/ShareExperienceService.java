package com.example.live_backend.service.Experience;

import com.example.live_backend.model.Experience.Experience;
import com.example.live_backend.model.Experience.ShareExperience;
import com.example.live_backend.model.Experience.ShareStatus;
import com.example.live_backend.model.User.User;
import com.example.live_backend.dto.Experience.ShareExperienceResponse;
import com.example.live_backend.dto.Experience.ShareExperienceRequest;
import com.example.live_backend.mapper.ShareExperienceMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.live_backend.repository.Experience.ShareExperienceRepository;
import com.example.live_backend.service.UserService;
import com.example.live_backend.service.GroupService;
import com.example.live_backend.model.User.Group;
import com.example.live_backend.model.User.GroupMembership;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShareExperienceService {
    private final ShareExperienceRepository shareExperienceRepository;
    private final UserService userService;
    private final ExperienceService experienceService;
    private final ShareExperienceMapper shareExperienceMapper;
    private final GroupService groupService;

    @Transactional
    public void shareExperience(Long experienceId, Long ownerId, ShareExperienceRequest request) {
        Experience experience = experienceService.getExperienceEntityById(experienceId, ownerId);
        User sharedWith = userService.getUserEntityById(request.getSharedWithUserId());
        ShareExperience share = shareExperienceMapper.toEntity(experience, sharedWith);
        shareExperienceRepository.save(share);
    }

    @Transactional
    public void unshareExperience(Long experienceId, Long ownerId, Long targetId) {
        User targetUser = userService.getUserEntityById(targetId);
        shareExperienceRepository.deleteByExperienceIdAndSharedWithId(experienceId, targetUser.getId());
    }

    public List<ShareExperienceResponse> getSharedExperiences(Long userId) {
        User user = userService.getUserEntityById(userId);
        List<ShareExperience> shares = shareExperienceRepository.findBySharedWithId(user.getId());
        return shares.stream()
            .map(shareExperienceMapper::toResponse)
            .collect(Collectors.toList());
    }

    public List<ShareExperienceResponse> getSharedExperiencesByExperienceId(Long experienceId) {
        List<ShareExperience> shares = shareExperienceRepository.findByExperienceId(experienceId);
        return shares.stream()
            .map(shareExperienceMapper::toResponse)
            .collect(Collectors.toList());
    }

    public void shareWithGroup(Long experienceId, Long groupId) {
        Group group = groupService.getGroupEntityById(groupId);

        Experience experience = experienceService.getExperienceById(experienceId);
    
        for (GroupMembership membership : group.getMemberships()) {
            User user = membership.getUser();
            ShareExperience share = shareExperienceMapper.toEntity(experience, user);
            shareExperienceRepository.save(share);
        }
    }

    public void shareWithFriends(Long experienceId, Long userId) {
        User user = userService.getUserEntityById(userId);
        Experience experience = experienceService.getExperienceById(experienceId);
        
        for (User friend : user.getFriends()) {
            ShareExperience share = shareExperienceMapper.toEntity(experience, friend);
            shareExperienceRepository.save(share);
        }
    }

    @Transactional
    public ShareExperienceResponse acceptShare(Long shareId, Long userId) {
        ShareExperience share = shareExperienceRepository.findById(shareId)
            .orElseThrow(() -> new RuntimeException("Share record not found"));

        // Ensure this share belongs to the user
        if (!share.getSharedWith().getId().equals(userId)) {
            throw new RuntimeException("Not your share to accept!");
        }

        share.setStatus(ShareStatus.ACCEPTED);

        shareExperienceRepository.save(share);

        return shareExperienceMapper.toResponse(share);
    }

    @Transactional
    public ShareExperienceResponse declineShare(Long shareId, Long userId) {
        ShareExperience share = shareExperienceRepository.findById(shareId)
            .orElseThrow(() -> new RuntimeException("Share record not found"));

        if (!share.getSharedWith().getId().equals(userId)) {
            throw new RuntimeException("Not your share to decline!");
        }

        share.setStatus(ShareStatus.DECLINED);
        shareExperienceRepository.save(share);

        return shareExperienceMapper.toResponse(share);
    }
}
