package com.example.live_backend.model.Experience;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.example.live_backend.model.User.User;

@Data
@Entity
@Table(name = "experience_shares",
       uniqueConstraints = @UniqueConstraint(columnNames = {"experience_id", "shared_with_id"}))
public class ShareExperience {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "experience_id", nullable = false)
    private Experience experience;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shared_with_id", nullable = false)
    private User sharedWith;

    @Column(name = "shared_at", nullable = false)
    private LocalDateTime sharedAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private ShareStatus status = ShareStatus.PENDING; 
} 