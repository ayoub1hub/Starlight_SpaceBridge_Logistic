package org.example.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EntrepotValidationRequest {

    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Role is required")
    private String role;
}