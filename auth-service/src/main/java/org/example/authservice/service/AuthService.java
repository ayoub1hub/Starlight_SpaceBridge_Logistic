package org.example.authservice.service;

import org.example.authservice.dto.AuthResponse;
import org.example.authservice.dto.LoginRequest;
import org.example.authservice.dto.RegisterRequest;
import org.example.authservice.dto.UserDto;
import org.example.authservice.entity.User;
import org.example.authservice.mapper.UserMapper;
// CORRECTED PACKAGE NAME
import org.example.authservice.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserMapper userMapper;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userMapper = userMapper;

        System.out.println("=== AuthService initialized ===");
        System.out.println("UserRepository: " + (userRepository != null ? "OK" : "NULL"));
        System.out.println("PasswordEncoder: " + (passwordEncoder != null ? "OK" : "NULL"));
        System.out.println("JwtService: " + (jwtService != null ? "OK" : "NULL"));
        System.out.println("AuthenticationManager: " + (authenticationManager != null ? "OK" : "NULL"));
        System.out.println("UserMapper: " + (userMapper != null ? "OK" : "NULL"));
    }

    public AuthResponse login(LoginRequest request) {
        System.out.println("=== AuthService.login() START ===");
        System.out.println("Email: " + request.getEmail());

        try {
            // Authenticate user credentials
            System.out.println("Attempting authentication...");
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );
            System.out.println("Authentication successful");
        } catch (Exception e) {
            System.err.println("Authentication failed: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Invalid email or password");
        }

        // Fetch user details
        System.out.println("Fetching user from database...");
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("User found: " + user.getId());

        // Generate JWT token
        System.out.println("Generating JWT token...");
        String jwtToken = jwtService.generateToken(user);
        System.out.println("Token generated successfully");

        // Return response
        AuthResponse response = AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();

        System.out.println("=== AuthService.login() END ===");
        return response;
    }

    public AuthResponse register(RegisterRequest request) {
        System.out.println("=== AuthService.register() START ===");
        System.out.println("Email: " + request.getEmail());
        System.out.println("FullName: " + request.getFullName());
        System.out.println("Password provided: " + (request.getPassword() != null && !request.getPassword().isEmpty()));

        // Check if email exists
        System.out.println("Checking if email exists...");
        if (userRepository.existsByEmail(request.getEmail())) {
            System.err.println("Email already exists!");
            throw new RuntimeException("Email already exists");
        }
        System.out.println("Email is available");

        // Map request to entity
        System.out.println("Mapping request to User entity...");
        User user = null;
        try {
            user = userMapper.toEntity(request);
            System.out.println("User mapped successfully");
            System.out.println("Mapped user email: " + user.getEmail());
            System.out.println("Mapped user fullName: " + user.getFullName());
            System.out.println("Mapped user role: " + (user.getRole() != null ? user.getRole() : "NULL"));
        } catch (Exception e) {
            System.err.println("UserMapper.toEntity() failed!");
            e.printStackTrace();
            throw new RuntimeException("Failed to map user: " + e.getMessage());
        }

        // Encode password
        System.out.println("Encoding password...");
        try {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            System.out.println("Password encoded successfully");
        } catch (Exception e) {
            System.err.println("Password encoding failed!");
            e.printStackTrace();
            throw new RuntimeException("Failed to encode password: " + e.getMessage());
        }

        // Save user
        System.out.println("Saving user to database...");
        User savedUser = null;
        try {
            savedUser = userRepository.save(user);
            System.out.println("User saved successfully with ID: " + savedUser.getId());
        } catch (Exception e) {
            System.err.println("Database save failed!");
            e.printStackTrace();
            throw new RuntimeException("Failed to save user: " + e.getMessage());
        }

        // Generate JWT
        System.out.println("Generating JWT token...");
        String jwtToken = null;
        try {
            jwtToken = jwtService.generateToken(savedUser);
            System.out.println("Token generated successfully");
        } catch (Exception e) {
            System.err.println("JWT generation failed!");
            e.printStackTrace();
            throw new RuntimeException("Failed to generate token: " + e.getMessage());
        }

        // Build response
        System.out.println("Building response...");
        AuthResponse response = AuthResponse.builder()
                .token(jwtToken)
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .role(savedUser.getRole().name())
                .build();

        System.out.println("=== AuthService.register() END ===");
        return response;
    }

    public UserDto getUserById(UUID id) {
        System.out.println("=== AuthService.getUserById() ===");
        System.out.println("Looking for user ID: " + id);

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        System.out.println("User found: " + user.getEmail());
        return userMapper.toDto(user);
    }

    public UserDto getUserByEmail(String email) {
        System.out.println("=== AuthService.getUserByEmail() ===");
        System.out.println("Looking for email: " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        System.out.println("User found: " + user.getId());
        return userMapper.toDto(user);
    }
}