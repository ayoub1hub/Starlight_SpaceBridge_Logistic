// src/main/java/org/example/authservice/dto/UserDto.java
package org.example.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private UUID id;
    private String email;
    private String fullName;
    private String role;
    private String entrepotCode;
    private String entrepotName;
    private Boolean enabled;
    private LocalDateTime createdAt;
}