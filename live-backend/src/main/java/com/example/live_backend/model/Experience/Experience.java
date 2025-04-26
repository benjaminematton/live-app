package com.example.live_backend.model.Experience;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.example.live_backend.model.Activity.Activity;
import com.example.live_backend.model.User.User;

@Data
@Entity
@Table(name = "Experience")
public class Experience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(nullable = false)
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private ExperienceStatus status = ExperienceStatus.UPCOMING;

    @OneToMany
    @JoinColumn(name = "experience_id")  // foreign key in Activity table
    private List<Activity> activities = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private ExperienceVisibility visibility = ExperienceVisibility.PRIVATE;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "experience")
    private Set<ShareExperience> shares;

    @Column(name = "photo_url")
    private String photoUrl;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public Set<ShareExperience> getShares() {
        return shares;
    }

    public String getStartingLocation() {
        if (activities != null && !activities.isEmpty()) {
            return activities.get(0).getLocation(); 
        }
        return null;
    }

    public double getStartingLatitude() {   
        if (activities != null && !activities.isEmpty()) {
            return activities.get(0).getLatitude();
        }
        return 0;
    }

    public double getStartingLongitude() {
        if (activities != null && !activities.isEmpty()) {
            return activities.get(0).getLongitude();
        }
        return 0;
    }
} 
