package org.example.commandeservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.*;
import java.util.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Builder
public class PurchaseOrderItemRequest {

    @NotNull
    private UUID productId;

    @Positive
    private Integer quantity;

    @PositiveOrZero
    private BigDecimal unitPrice;

    @PositiveOrZero
    private BigDecimal discount = BigDecimal.ZERO;
}