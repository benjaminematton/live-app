package com.example.live_backend.model.User;

import java.time.LocalDateTime;

import com.example.live_backend.model.Achievement;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "user_achievements")
public class UserAchievement {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Achievement achievement;

    private LocalDateTime dateEarned;

    // e.g., points or some notion of "level" or "progress"
    private int points;
}