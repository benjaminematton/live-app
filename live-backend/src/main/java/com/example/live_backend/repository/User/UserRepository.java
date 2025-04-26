package com.example.live_backend.repository.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.live_backend.model.User.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    @Query(value = """
        SELECT u.*
        FROM user_following uf1
        JOIN user_following uf2 ON uf1.followee_id = uf2.follower_id
        JOIN users u ON u.id = uf1.followee_id
        WHERE uf1.follower_id = :userId
        AND uf2.followee_id = :userId
        AND (
            LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(CONCAT(u.first_name, ' ', u.last_name)) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        LIMIT 5
    """, nativeQuery = true)
    List<User> searchFriends(@Param("userId") Long userId, @Param("query") String query);

} 