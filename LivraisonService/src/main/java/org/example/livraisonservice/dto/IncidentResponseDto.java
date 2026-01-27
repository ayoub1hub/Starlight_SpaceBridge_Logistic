package org.example.livraisonservice.dto;

import lombok.Data;
import org.example.livraisonservice.entity.IncidentStatus;
import org.example.livraisonservice.entity.SeverityLevel;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
public class IncidentResponseDto {
    private UUID id;
    private String incidentCode;
    private String type;
    private SeverityLevel severity;
    private String description;
    private UUID deliveryId;
    private UUID warehouseId;
    private String reportedBy;
    private LocalDateTime reportedAt;
    private List<String> photoUrls;
    private IncidentStatus status;
    private LocalDateTime resolvedAt;
    private LocalDateTime updatedAt;
}