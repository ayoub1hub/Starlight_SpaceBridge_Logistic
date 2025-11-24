package org.example.livraisonservice.entity;

import com.example.sslproject.livraisonservice.entity.Driver;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "route")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    private String vehicleType;
    private String originLocation;
    private String destinationLocation;
    private String routeType;

    private Double distanceKm;
    private Double estimatedDurationHours;
    private String fuelType;
    private String status;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Integer totalDeliveries;
    private Integer completedDeliveries;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}