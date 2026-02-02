package org.example.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntrepotValidationResponse {

    private boolean valid;
    private String message;
    private String entrepotId;

    public static EntrepotValidationResponse success(String entrepotId) {
        return new EntrepotValidationResponse(true, "Valid credentials", entrepotId);
    }

    public static EntrepotValidationResponse failure(String message) {
        return new EntrepotValidationResponse(false, message, null);
    }
}