package org.example.stockservice.dto;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReserveStockRequest {
    private UUID warehouseId;
    private List<ReserveStockItem> items;
}