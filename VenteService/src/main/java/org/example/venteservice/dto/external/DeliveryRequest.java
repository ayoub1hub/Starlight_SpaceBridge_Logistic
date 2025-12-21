package org.example.venteservice.dto.external;

import lombok.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryRequest {
    private String orderReference;
    private UUID warehouseId;
    private String deliveryAddress;
    private String customerName;
    private String status = "PENDING";
    private LocalDate scheduledDate;
    private String notes;
    private List<DeliveryItemDto> items;
}