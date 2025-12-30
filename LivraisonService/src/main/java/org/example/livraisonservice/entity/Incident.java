package org.example.livraisonservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String incidentCode; // ex: INC-2025-001

    @Enumerated(EnumType.STRING)
    private IncidentType type;

    @Enumerated(EnumType.STRING)
    private SeverityLevel severity;

    private String description;

    private UUID deliveryId;

    private UUID warehouseId;

    private String reportedBy;

    private LocalDateTime reportedAt = LocalDateTime.now();

    @ElementCollection
    private List<String> photoUrls = new ArrayList<>();

    private boolean resolved = false;

    private LocalDateTime resolvedAt;
}

