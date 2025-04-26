package com.example.live_backend.service;

// Java standard imports
import java.util.List;

// Spring imports
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// Project imports - DTOs
import com.example.live_backend.dto.User.UpdateEmailRequest;
import com.example.live_backend.dto.User.UpdatePasswordRequest;
import com.example.live_backend.dto.User.UserProfileRequest;
import com.example.live_backend.dto.User.UserProfileResponse;
import com.example.live_backend.dto.User.UserRequest;
import com.example.live_backend.dto.User.UserResponse;

// Project imports - Models and Repository
import com.example.live_backend.model.User.GroupMembership;
import com.example.live_backend.model.User.User;
import com.example.live_backend.mapper.UserMapper;
import com.example.live_backend.repository.User.UserRepository;

// Lombok
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    /**
     * Retrieves a User entity by ID
     * @param id The user ID
     * @return User entity
     * @throws UsernameNotFoundException if user not found
     */
    public User getUserEntityById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        return user;
    }

    /**
     * Retrieves a user's data in DTO format
     * @param id The user ID
     * @return UserResponse DTO
     */
    public UserResponse getUserById(Long id) {
        User user = getUserEntityById(id);
        return userMapper.toResponse(user);
    }

    /**
     * Updates a user's basic information
     * @param id The user ID
     * @param request The update request data
     * @return Updated user data as DTO
     */
    @Transactional
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = getUserEntityById(id);

        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    /**
     * Updates a user's profile information
     * @param id The user ID
     * @param request The profile update request
     * @return Updated profile data as DTO
     */
    @Transactional
    public UserProfileResponse updateUserProfile(Long id, UserProfileRequest request) {
        User user = getUserEntityById(id);
        userMapper.updateUserFromProfileRequest(user, request);
        User updatedUser = userRepository.save(user);
        return userMapper.toUserProfileResponse(updatedUser);
    }

    /**
     * Retrieves filtered list of user's friends
     * @param id The user ID
     * @param query Optional search query to filter friends
     * @return Set of matching friends as DTOs
     */
    public List<UserResponse> getFriends(Long userId, String query) {
        if (query != null && !query.isBlank()) {
            return userRepository.searchFriends(userId, query)
                .stream()
                .map(userMapper::toResponse)
                .toList();
        } else {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    
            return user.getFriends().stream()
                .map(userMapper::toResponse)
                .toList();
        }
    }
    

    /**
     * Adds a user to current user's following list
     * @param currentUserId The ID of the user performing the follow
     * @param userIdToFollow The ID of the user to be followed
     */
    public void followUser(Long currentUserId, Long userIdToFollow) {
        User currentUser = userRepository.findById(currentUserId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found")); 
        User userToFollow = userRepository.findById(userIdToFollow)
            .orElseThrow(() -> new UsernameNotFoundException("User to follow not found"));

        // Add userToFollow to currentUser's following set
        currentUser.getFollowing().add(userToFollow);
        userRepository.save(currentUser);
    }

    /**
     * Removes a user from current user's following list
     * @param currentUserId The ID of the user performing the unfollow
     * @param userIdToUnfollow The ID of the user to be unfollowed
     */
    public void unfollowUser(Long currentUserId, Long userIdToUnfollow) {
        User currentUser = userRepository.findById(currentUserId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        User userToUnfollow = userRepository.findById(userIdToUnfollow)
            .orElseThrow(() -> new UsernameNotFoundException("User to unfollow not found"));

        currentUser.getFollowing().remove(userToUnfollow);
        userRepository.save(currentUser);
    }

    /**
     * Gets list of users that the specified user is following
     * @param id The user ID
     * @return Set of followed users as DTOs
     */
    public List<UserResponse> getFollowing(Long id) {   
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getFollowing().stream()
            .map(userMapper::toResponse)
            .toList();
    }

    /**
     * Gets list of users following the specified user
     * @param id The user ID
     * @return Set of followers as DTOs
     */
    public List<UserResponse> getFollowers(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.getFollowers().stream()
            .map(userMapper::toResponse)
            .toList();
    }

    /**
     * Retrieves all group memberships for a user
     * @param userId The user ID
     * @return List of group memberships
     */
    public List<GroupMembership> getGroupMembershipsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getGroupMemberships();
    }

    /**
     * Checks if user has enabled location sharing
     * @param userId The user ID
     * @return boolean indicating if location sharing is enabled
     */
    public boolean getUserShareLocation(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return user.isShareLocation();
    }

    /**
     * Updates user's location sharing preference
     * @param userId The user ID
     * @param shareLocation New location sharing preference
     */
    public void setUserShareLocation(Long userId, boolean shareLocation) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setShareLocation(shareLocation);
        userRepository.save(user);
    }

    /**
     * Updates user's email address
     * @param userId The user ID
     * @param request New email request
     */
    public void updateEmail(Long userId, UpdateEmailRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEmail(request.getNewEmail());
        userRepository.save(user);
    }

    /**
     * Updates user's password
     * @param userId The user ID
     * @param request New password request
     */
    public void updatePassword(Long userId, UpdatePasswordRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
} 
