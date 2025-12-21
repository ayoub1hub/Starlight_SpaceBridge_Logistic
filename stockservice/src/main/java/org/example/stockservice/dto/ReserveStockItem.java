package org.example.stockservice.dto;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReserveStockItem {
    private UUID productId;
    private Integer quantity;
}