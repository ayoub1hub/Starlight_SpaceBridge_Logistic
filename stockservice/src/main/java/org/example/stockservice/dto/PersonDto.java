package org.example.stockservice.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PersonDto {
    private UUID id;
    private String type;
    // e.g. "admin","respo","livreur" ...
    @NotBlank(message = "Name is required")
    private String name;
    @Email(message = "Email must be valid")
    private String email;
    private Boolean isActive=true;
    private String phone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}