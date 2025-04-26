package com.example.live_backend.mapper;

import com.example.live_backend.dto.User.UserRequest;
import com.example.live_backend.dto.User.UserResponse;
import com.example.live_backend.dto.User.UserProfileRequest;
import com.example.live_backend.dto.User.UserProfileResponse;
import com.example.live_backend.model.User.User;

import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFullName(user.getFullName());
        response.setProfilePicture(user.getProfilePicture());
        return response;
    }

    public UserProfileResponse toUserProfileResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setLocation(user.getLocation());
        response.setShareLocation(user.isShareLocation());
        return response;
    }

    public void updateUserFromProfileRequest(User user, UserProfileRequest request) {
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setLocation(request.getLocation());
        user.setShareLocation(request.getShareLocation());
        user.setGetNotifications(request.getGetNotifications());
    }

    public void updateEntity(User user, UserRequest request) {
        user.setUsername(request.getUsername());
        user.setLocation(request.getLocation());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
    }

    public User toEntity(UserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setLocation(request.getLocation());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        return user;
    }
}
