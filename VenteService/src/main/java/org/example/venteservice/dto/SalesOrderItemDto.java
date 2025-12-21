package org.example.venteservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SalesOrderItemDto {

    @NotNull
    private UUID productId;

    @Positive
    private Integer quantity;

    @PositiveOrZero
    private BigDecimal unitPrice;
}