package LivraisonService.src.main.java.org.example.livraisonservice.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryTrackingDto {
    private UUID id;
    private UUID deliveryId;
    private Double latitude;
    private Double longitude;
    private LocalDateTime timestamp;
    private String status; // "DEPARTED", "EN_ROUTE", "ARRIVED", "DELIVERED"
}