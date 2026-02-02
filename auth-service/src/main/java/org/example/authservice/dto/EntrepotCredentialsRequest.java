

package org.example.authservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EntrepotCredentialsRequest {

    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Password is required")
    private String password;
}