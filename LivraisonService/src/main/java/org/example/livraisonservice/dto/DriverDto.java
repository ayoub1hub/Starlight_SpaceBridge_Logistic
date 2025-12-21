package org.example.livraisonservice.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverDto {
    private UUID id;

    // remplis via appel à stockservice
    private String name;
    private String phone;

    private String vehiclePlateNumber;
    private String vehicleType;
    private String licenseNumber;
    private Double rating;
    private String status;

    private Boolean available;

    private UUID personId;

    private Double currentLatitude;
    private Double currentLongitude;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}