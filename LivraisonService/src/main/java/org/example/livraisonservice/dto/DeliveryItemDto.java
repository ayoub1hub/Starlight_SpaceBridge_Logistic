package org.example.livraisonservice.dto;

import java.math.BigDecimal;
import java.util.UUID;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryItemDto {
    private UUID productId;
    private String productName;
    private int quantity;
    private BigDecimal unitPrice;
}