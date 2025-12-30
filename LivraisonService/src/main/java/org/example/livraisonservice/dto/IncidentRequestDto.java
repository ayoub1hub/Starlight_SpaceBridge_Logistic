package org.example.livraisonservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.example.livraisonservice.entity.*;

import java.util.List;
import java.util.UUID;

public record IncidentRequestDto(
        @NotNull IncidentType type,
        @NotNull SeverityLevel severity,
        @NotBlank String description,
        UUID deliveryId,
        List<String> photoUrls
) {}