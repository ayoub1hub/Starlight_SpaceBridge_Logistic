package org.example.venteservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.util.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SalesOrderRequest {

    @NotBlank
    private String orderNumber;

    @NotNull
    private UUID customerId;

    @NotNull
    private UUID warehouseId;

    private LocalDate expectedDeliveryDate;

    @NotEmpty
    private List<SalesOrderItemDto> items;
}