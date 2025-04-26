package com.example.live_backend.model.User;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

import com.example.live_backend.model.Experience.Experience;
import com.example.live_backend.model.Experience.ShareExperience;
import com.example.live_backend.model.Social.Post;

import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "users")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String username;

    @NotBlank
    @Email
    @Column(unique = true)
    private String email;

    @NotBlank
    private String password;

    @Column(length = 1000)
    private String profilePicture;

    private String firstName;

    private String lastName;

    private String location;

    private boolean shareLocation = false;

    private boolean getNotifications = true;

    @ManyToMany
    @JoinTable(
        name = "user_following",
        joinColumns = @JoinColumn(name = "follower_id"),
        inverseJoinColumns = @JoinColumn(name = "followee_id")
    )
    private List<User> following;

    @ManyToMany(mappedBy = "following")
    private List<User> followers;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts;

    @OneToMany(mappedBy = "sharedWith", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ShareExperience> sharedExperiences;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupMembership> groupMemberships;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Experience> userExperiences;

    private boolean prefersDarkMode = false;

    /**
     * Checks if this user is friends with another user
     * @param otherUser The user to check friendship status with
     * @return true if users mutually follow each other, false otherwise
     */
    public boolean isFriendsWith(User otherUser) {
        return this.following.contains(otherUser) 
            && this.followers.contains(otherUser);
    }

    /**
     * Gets all users who have a mutual following relationship with this user
     * @return Set of users who are mutual followers (friends)
     */
    public Set<User> getFriends() {
        Set<User> mutual = new HashSet<>(this.following);
        mutual.retainAll(this.followers);  // Intersection
        return mutual;
    }

    /**
     * full name
     * @return String containing the user's full name
     */
    public String getFullName() {
        return this.firstName + " " + this.lastName;
    }
    

}
