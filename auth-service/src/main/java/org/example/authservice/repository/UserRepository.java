// src/main/java/org/example/authservice/repository/UserRepository.java
package org.example.authservice.repository;

import org.example.authservice.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByKeycloakId(String keycloakId);

    Boolean existsByEmail(String email);
}