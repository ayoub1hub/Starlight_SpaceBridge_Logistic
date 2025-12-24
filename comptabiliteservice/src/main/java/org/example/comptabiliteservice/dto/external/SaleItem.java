package org.example.comptabiliteservice.dto.external;

import java.util.UUID;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SaleItem {
    UUID productId;
    String description;
    Integer quantity;
    Double unitPrice;
    Double taxRate;
    Double discountRate;
}
