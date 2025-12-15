package org.example.authservice.controller;

import jakarta.validation.Valid;
import org.example.authservice.dto.AuthResponse;
import org.example.authservice.dto.LoginRequest;
import org.example.authservice.dto.RegisterRequest;
import org.example.authservice.dto.UserDto;
import org.example.authservice.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ========== DEBUG ENDPOINTS ==========

    @PostMapping("/test")
    public ResponseEntity<?> test(@RequestBody Map<String, Object> body) {
        System.out.println("=== TEST ENDPOINT ===");
        System.out.println("Received body: " + body);
        return ResponseEntity.ok(Map.of(
                "received", body,
                "size", body.size(),
                "keys", body.keySet(),
                "message", "JSON parsing works!"
        ));
    }

    @PostMapping("/test-register")
    public ResponseEntity<?> testRegister(@RequestBody RegisterRequest request) {
        System.out.println("=== TEST REGISTER (No Validation) ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Password: " + (request.getPassword() != null ? "***" : "NULL"));
        System.out.println("FullName: " + request.getFullName());
        return ResponseEntity.ok(Map.of(
                "email", request.getEmail(),
                "password", "***",
                "fullName", request.getFullName(),
                "message", "DTO mapping works!"
        ));
    }

    @PostMapping("/test-register-validated")
    public ResponseEntity<?> testRegisterValidated(@Valid @RequestBody RegisterRequest request) {
        System.out.println("=== TEST REGISTER (With Validation) ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("Password: " + (request.getPassword() != null ? "***" : "NULL"));
        System.out.println("FullName: " + request.getFullName());
        return ResponseEntity.ok(Map.of(
                "email", request.getEmail(),
                "password", "***",
                "fullName", request.getFullName(),
                "message", "Validation passed!"
        ));
    }

    // ========== ACTUAL ENDPOINTS ==========

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        System.out.println("=== LOGIN ENDPOINT ===");
        System.out.println("Email: " + request.getEmail());
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        System.out.println("=== REGISTER ENDPOINT ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("FullName: " + request.getFullName());
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(201).body(response);
        } catch (RuntimeException e) {
            System.err.println("Register error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable UUID id) {
        UserDto user = authService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/users/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String email) {
        UserDto user = authService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "auth-service",
                "port", "8087"
        ));
    }
}