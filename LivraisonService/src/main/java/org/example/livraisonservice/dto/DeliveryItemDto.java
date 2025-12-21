package org.example.livraisonservice.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@NoArgsConstructor@AllArgsConstructor@Builder
public class DeliveryItemDto {

    private UUID id;
    private UUID productId;

    private String productName;
    private Integer quantity;

    private Boolean isDelivered = false;
    private String conditionOnDelivery; // "Neuf", "Endommagé", etc.
    private String notes;

    private BigDecimal unitPrice;
}