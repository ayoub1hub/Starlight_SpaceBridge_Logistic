package org.example.commandeservice.dto;

import lombok.*;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class PurchaseOrderRequest {

    @NotBlank(message = "Order number is required")
    private String orderNumber;

    @NotNull(message = "Supplier ID is required")
    private UUID supplierId;

    private String status;

    private LocalDate expectedDeliveryDate;

    @NotEmpty(message = "At least one item is required")
    private List<@NotNull PurchaseOrderItemDto> items;
}