package org.example.livraisonservice.dto;

import lombok.*;
import java.time.*;
import java.util.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeliveryDto {

    private UUID id;
    private String deliveryNumber;
    private String orderReference;
    private UUID warehouseId;
    private String customerName;

    private DriverDto driver;

    private String deliveryAddress;
    private Double destinationLatitude;
    private Double destinationLongitude;

    private String status;                   // SCHEDULED, IN_TRANSIT, DELIVERED, CANCELLED, ...
    private String priority;                 // High, Normal, Low

    private LocalDate scheduledDate;
    private LocalDateTime scheduledAt;      //sous cntraint
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;

    private Double estimatedDistanceKm;
    private Double actualDistanceKm;

    private String notes;   //optional

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Builder.Default
    private List<DeliveryItemDto> items = new ArrayList<>();

    private DeliveryProofDto proof;
}