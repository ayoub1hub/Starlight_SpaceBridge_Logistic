package org.example.livraisonservice.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class RouteDto {
    private UUID id;
    private String name;
    private List<String> waypoints; // [lat,lng] ou adresses
    private LocalDateTime plannedStart;
    private LocalDateTime estimatedEnd;
    private int totalDeliveries;
}