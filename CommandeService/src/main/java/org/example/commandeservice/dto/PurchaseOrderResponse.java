package org.example.commandeservice.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseOrderResponse {

    private UUID id;
    private String orderNumber;
    private LocalDate expectedDeliveryDate;

    private SupplierDto supplier;
    private List<PurchaseOrderItemDto> items;


    private String status;
    private Double totalAmount;
    private CustomsDeclarationDto customsDeclaration;
}