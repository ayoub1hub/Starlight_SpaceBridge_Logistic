package org.example.commandeservice.dto.external;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockUpdateItem {
    private UUID productId;
    private Integer quantity;
}