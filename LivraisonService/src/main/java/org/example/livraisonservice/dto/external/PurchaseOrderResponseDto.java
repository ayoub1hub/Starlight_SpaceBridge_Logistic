package org.example.livraisonservice.dto.external;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PurchaseOrderResponseDto {

    private UUID id;
    private String orderNumber;
    private UUID supplierId;
    private UUID warehouseId;
    private String status;
    private LocalDate expectedDeliveryDate;
    private BigDecimal totalAmount;
    private List<PurchaseOrderItemDto> items;
}