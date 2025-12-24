package org.example.commandeservice.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderItemDto {
    private UUID id;
    private UUID purchaseOrderId;
    private Integer quantity;
    private UUID productId;
    private BigDecimal unitPrice; // BigDecimal for money!
    private BigDecimal totalPrice;
    private BigDecimal taxAmount;
    private BigDecimal discount;
}