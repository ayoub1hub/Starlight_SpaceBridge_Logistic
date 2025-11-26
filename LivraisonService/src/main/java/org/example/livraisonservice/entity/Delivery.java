package org.example.livraisonservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "deliveries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String deliveryNumber;

    private String orderReference;
    private UUID warehouseId;
    private UUID customerId;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    private String deliveryAddress;
    private Double destinationLatitude;
    private Double destinationLongitude;

    private String status;   // e.g. "Scheduled", "In Transit", "Delivered", "Cancelled"
    private String priority; // e.g. "High", "Normal", "Low"

    private LocalDate scheduledDate;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    private Double estimatedDistanceKm;
    private Double actualDistanceKm;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "delivery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeliveryItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "delivery", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeliveryTracking> trackingRecords = new ArrayList<>();

    @OneToOne(mappedBy = "delivery", cascade = CascadeType.ALL, orphanRemoval = true)
    private DeliveryProof proof;
}