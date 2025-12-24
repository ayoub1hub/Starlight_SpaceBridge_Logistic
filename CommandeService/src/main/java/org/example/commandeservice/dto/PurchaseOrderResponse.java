package org.example.commandeservice.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderResponse {

    private UUID id;
    private String orderNumber;
    private LocalDate expectedDeliveryDate;

    private SupplierDto supplier;
    private List<PurchaseOrderItemDto> items;

    private String status;
    private BigDecimal totalPrice;
    private BigDecimal totalAmount;
    private CustomsDeclarationDto customsDeclaration;
}