package com.example.live_backend.repository.Experience;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.live_backend.model.Experience.Experience;

import java.time.LocalDateTime;
import java.util.List;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
    List<Experience> findByUserIdOrderByStartDateDesc(Long userId);

    List<Experience> findByUserUsernameOrderByStartDateDesc(String username);

    @Query("SELECT e FROM Experience e WHERE e.startDate BETWEEN :now AND :trackingStartTime AND e.status = 'UPCOMING'")
    List<Experience> findUpcomingExperiences(LocalDateTime now, LocalDateTime trackingStartTime);
    
    @Query("SELECT e FROM Experience e WHERE e.startDate > :now ORDER BY e.startDate ASC")
    List<Experience> findAllFutureExperiences(LocalDateTime now);
}
