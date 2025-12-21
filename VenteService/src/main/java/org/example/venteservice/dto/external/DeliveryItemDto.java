package org.example.venteservice.dto.external;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryItemDto {
    private UUID productId;
    private Integer quantity;
    private BigDecimal unitPrice;
}