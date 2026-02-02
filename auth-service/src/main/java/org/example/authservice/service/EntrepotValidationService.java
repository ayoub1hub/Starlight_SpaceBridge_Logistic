// src/main/java/org/example/authservice/service/EntrepotValidationService.java
package org.example.authservice.service;

import org.example.authservice.dto.EntrepotValidationResponse;
import org.example.authservice.dto.UserDto;
import org.example.authservice.entity.Entrepot;
import org.example.authservice.entity.User;
import org.example.authservice.mapper.UserMapper;
import org.example.authservice.repository.EntrepotRepository;
import org.example.authservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class EntrepotValidationService {

    private final UserRepository userRepository;
    private final EntrepotRepository entrepotRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public EntrepotValidationService(
            UserRepository userRepository,
            EntrepotRepository entrepotRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.entrepotRepository = entrepotRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * NEW METHOD: Validate entrepot credentials (code + password)
     * This is called BEFORE Keycloak authentication (Step 1)
     * Returns entrepot ID if valid
     */
    public EntrepotValidationResponse validateEntrepotCredentials(String code, String password) {
        System.out.println("📝 Validating entrepot credentials for code: " + code);

        Optional<Entrepot> entrepotOpt = entrepotRepository.findByCode(code);

        if (entrepotOpt.isEmpty()) {
            System.out.println("❌ Entrepot not found with code: " + code);
            return EntrepotValidationResponse.failure("Invalid entrepot code");
        }

        Entrepot entrepot = entrepotOpt.get();

        // ✅ Use isActive() for primitive boolean 'active'
        if (!entrepot.isActive()) {
            System.out.println("❌ Entrepot is inactive: " + code);
            return EntrepotValidationResponse.failure("Entrepot is inactive");
        }

        // Verify password
        if (!passwordEncoder.matches(password, entrepot.getPassword())) {
            System.out.println("❌ Invalid password for entrepot: " + code);
            return EntrepotValidationResponse.failure("Invalid password");
        }

        System.out.println("✅ Entrepot credentials valid: " + code);
        return EntrepotValidationResponse.success(entrepot.getId().toString());
    }

    /**
     * EXISTING METHOD: Validates if a Keycloak user can access the given entrepot with the requested role.
     * This is called AFTER Keycloak authentication (Step 3)
     */
    public boolean isValidEntrepotForUser(String entrepotCode, String keycloakId, String requestedRole) {
        System.out.println("🔍 Checking entrepot access for Keycloak ID: " + keycloakId);

        Optional<User> userOpt = userRepository.findByKeycloakId(keycloakId);
        if (userOpt.isEmpty()) {
            System.out.println("❌ User not found with Keycloak ID: " + keycloakId);
            return false;
        }

        User user = userOpt.get();
        System.out.println("✅ User found: " + user.getEmail());

        // Role must match (case-insensitive)
        if (!user.getRole().name().equalsIgnoreCase(requestedRole)) {
            System.out.println("❌ Role mismatch. User role: " + user.getRole() + ", Requested: " + requestedRole);
            return false;
        }

        // Must be linked to an entrepot
        if (user.getEntrepot() == null) {
            System.out.println("❌ User not linked to any entrepot");
            return false;
        }

        // Entrepot code must match
        boolean matches = user.getEntrepot().getCode().equals(entrepotCode);
        if (!matches) {
            System.out.println("❌ Entrepot code mismatch. User's: " + user.getEntrepot().getCode() + ", Requested: " + entrepotCode);
        } else {
            System.out.println("✅ Entrepot access granted");
        }

        return matches;
    }

    // User management methods
    public UserDto getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        return userMapper.toDto(user);
    }

    public UserDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return userMapper.toDto(user);
    }
}