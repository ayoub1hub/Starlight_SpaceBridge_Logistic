package org.example.venteservice.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SalesOrderResponse {

    private UUID id;
    private String orderNumber;
    private UUID customerId;
    private UUID warehouseId;
    private String status;
    private LocalDate expectedDeliveryDate;
    private BigDecimal totalAmount;
    private UUID deliveryId;
    private UUID invoiceId;
    private List<SalesOrderItemDto> items;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}