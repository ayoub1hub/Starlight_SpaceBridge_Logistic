package org.example.livraisonservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.example.livraisonservice.entity.SeverityLevel;

import java.util.UUID;

@Data
public class IncidentRequestDto {
    @NotNull
    private UUID deliveryId;

    @NotBlank
    private String type;  // "delay", "damage", etc. → sera mappé vers IncidentType

    @NotNull
    private SeverityLevel severity;

    @NotBlank
    private String description;
}