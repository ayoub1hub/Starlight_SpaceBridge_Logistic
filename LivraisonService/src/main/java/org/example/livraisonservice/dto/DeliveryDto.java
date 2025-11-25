package LivraisonService.src.main.java.org.example.livraisonservice.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDto {
    private UUID id;
    private String reference;
    private LocalDateTime scheduledAt;
    private LocalDateTime deliveredAt;
    private String status; // "PENDING", "IN_PROGRESS", "DELIVERED", "FAILED"
    private UUID driverId;
    private UUID routeId;
    private List<DeliveryItemDto> items;
    private DeliveryProofDto proof;

}
