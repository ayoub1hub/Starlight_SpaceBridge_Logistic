package org.example.livraisonservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "incidents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String incidentCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeverityLevel severity;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private UUID deliveryId;

    @Column(nullable = false)
    private UUID warehouseId;

    @Column(nullable = false)
    private String reportedBy;

    @Column(nullable = false)
    private UUID driverId;

    @Column(nullable = false)
    private LocalDateTime reportedAt;

    @ElementCollection
    @CollectionTable(name = "incident_photos", joinColumns = @JoinColumn(name = "incident_id"))
    private List<String> photoUrls = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatus status = IncidentStatus.OPEN;

    private LocalDateTime resolvedAt;

    private LocalDateTime updatedAt;
}