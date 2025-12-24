package org.example.commandeservice.dto.external;

import lombok.*;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockUpdateRequest {
    private UUID warehouseId;
    private List<StockUpdateItem> items;
}