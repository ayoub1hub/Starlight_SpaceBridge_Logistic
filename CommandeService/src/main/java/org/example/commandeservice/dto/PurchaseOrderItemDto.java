package org.example.commandeservice.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderItemDto {
    private UUID id;
    private UUID purchaseOrderId;
    private Integer quantity;
    private BigDecimal unitPrice;

}