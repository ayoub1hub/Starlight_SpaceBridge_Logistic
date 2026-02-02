// src/main/java/org/example/authservice/controller/AuthController.java
package org.example.authservice.controller;

import jakarta.validation.Valid;
import org.example.authservice.dto.EntrepotCredentialsRequest;
import org.example.authservice.dto.EntrepotValidationRequest;
import org.example.authservice.dto.EntrepotValidationResponse;
import org.example.authservice.dto.UserDto;
import org.example.authservice.service.EntrepotValidationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final EntrepotValidationService entrepotValidationService;

    public AuthController(EntrepotValidationService entrepotValidationService) {
        this.entrepotValidationService = entrepotValidationService;
    }

    /**
     * NEW ENDPOINT: Step 1 - Public entrepot credential validation
     * This endpoint does NOT require Keycloak authentication
     * It validates entrepot code + password before sending user to Keycloak
     */
    @PostMapping("/auth/entrepot/validate-credentials")
    public ResponseEntity<EntrepotValidationResponse> validateEntrepotCredentials(
            @Valid @RequestBody EntrepotCredentialsRequest request) {

        System.out.println("=== ENTREPOT CREDENTIALS VALIDATION (PUBLIC) ===");
        System.out.println("Code: " + request.getCode());

        EntrepotValidationResponse response = entrepotValidationService
                .validateEntrepotCredentials(request.getCode(), request.getPassword());

        if (response.isValid()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body(response);
        }
    }

    /**
     * EXISTING ENDPOINT: Step 3 - Validate entrepot access after Keycloak login
     * This endpoint REQUIRES Keycloak authentication
     * It ensures the authenticated user has access to the requested entrepot + role
     */
    @PostMapping("/auth/entrepot/validate")
    public ResponseEntity<?> validateEntrepotAccess(
            @AuthenticationPrincipal OidcUser user,
            @Valid @RequestBody EntrepotValidationRequest request) {

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "valid", false,
                    "message", "Authentication required"
            ));
        }

        String userId = user.getSubject();
        String email = user.getEmail();
        List<String> roles = user.getClaimAsStringList("realm_access.roles");

        System.out.println("=== ENTREPOT ACCESS VALIDATION (AUTHENTICATED) ===");
        System.out.println("User ID (sub): " + userId);
        System.out.println("Email: " + email);
        System.out.println("Requested role: " + request.getRole());
        System.out.println("User's Keycloak roles: " + roles);
        System.out.println("Entrepot code: " + request.getCode());

        // Check if user has the Keycloak role
        if (!roles.contains(request.getRole())) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "You are not assigned the role '" + request.getRole() + "' in Keycloak"
            ));
        }

        // Check if user has access to this entrepot
        boolean valid = entrepotValidationService.isValidEntrepotForUser(
                request.getCode(), userId, request.getRole()
        );

        if (valid) {
            return ResponseEntity.ok(Map.of(
                    "valid", true,
                    "message", "Access granted"
            ));
        } else {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "Invalid entrepot code or access not permitted for your account"
            ));
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(
            @AuthenticationPrincipal OidcUser user,
            @PathVariable UUID id) {
        UserDto userDto = entrepotValidationService.getUserById(id);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/users/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(
            @AuthenticationPrincipal OidcUser user,
            @PathVariable String email) {
        UserDto userDto = entrepotValidationService.getUserByEmail(email);
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "auth-service",
                "port", "8087",
                "auth_model", "keycloak-native"
        ));
    }

    @PostMapping("/test")
    public ResponseEntity<?> test(
            @AuthenticationPrincipal OidcUser user,
            @RequestBody Map<String, Object> body) {
        System.out.println("=== TEST ENDPOINT ===");
        System.out.println("Authenticated user: " + (user != null ? user.getEmail() : "none"));
        System.out.println("Received body: " + body);
        return ResponseEntity.ok(Map.of(
                "received", body,
                "user", user != null ? user.getEmail() : "anonymous",
                "message", "Keycloak + Spring Boot integration test"
        ));
    }
}