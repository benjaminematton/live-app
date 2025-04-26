package com.example.live_backend.service;

import com.example.live_backend.repository.Social.PostRepository;
import com.example.live_backend.repository.User.UserRepository;

import java.util.List;
import java.util.Collections;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

import com.example.live_backend.dto.Post.PostResponse;
import com.example.live_backend.mapper.PostMapper;
import com.example.live_backend.model.User.User;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostMapper postMapper;
    
    public List<PostResponse> getFollowingFeed(String currentUsername) {
        User currentUser = userRepository.findByUsername(currentUsername)
            .orElseThrow(() -> new UsernameNotFoundException(currentUsername));

        // The users that the current user is following
        List<User> usersIFollow = currentUser.getFollowing();

        if (usersIFollow.isEmpty()) {
            return Collections.emptyList();
        }

        // Query posts where author is in the set of followed users
        return postRepository.findByUsers(usersIFollow).stream()
            .map(postMapper::toResponse)
            .toList();
    }

    // For the "explore" feed
    public List<PostResponse> getExploreFeed() {
        return postRepository.findPublicPostsOrderByCreatedAtDesc().stream()
            .map(postMapper::toResponse)
            .toList();
    }

    // or for trending:
    public List<PostResponse> getTrendingFeed() {
        return postRepository.findPublicPostsOrderByLikeCountDesc().stream()
            .map(postMapper::toResponse)
            .toList();
    }
}