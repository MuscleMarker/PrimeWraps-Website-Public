package com.primewraps.repository;

import com.primewraps.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repository interface for User entities.
 * Provides CRUD operations for User objects and a method to find a user by username.
 */
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Finds a user by their username.
     * @param username The username to search for.
     * @return An Optional containing the User if found, or empty if not found.
     */
    Optional<User> findByUsername(String username);
}