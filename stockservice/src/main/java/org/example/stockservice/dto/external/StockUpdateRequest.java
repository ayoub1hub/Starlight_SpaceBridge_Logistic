package org.example.stockservice.dto.external;

import lombok.*;
import java.util.*;

@Getter
@Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockUpdateRequest {
    private UUID warehouseId;
    private List<StockUpdateItem> items;
}
