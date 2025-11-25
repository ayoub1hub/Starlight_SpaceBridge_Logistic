package org.example.commandeservice.dto;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PurchaseOrderRequest {
    private String orderNumber;
    private UUID supplierId;
    private List<PurchaseOrderItemDto> items;
}