package org.example.livraisonservice.dto;

import org.example.livraisonservice.entity.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record IncidentResponseDto(
        UUID id,
        String incidentCode,
        IncidentType type,
        SeverityLevel severity,
        String description,
        UUID deliveryId,
        String reportedBy,
        LocalDateTime reportedAt,
        List<String> photoUrls,
        boolean resolved
) {}