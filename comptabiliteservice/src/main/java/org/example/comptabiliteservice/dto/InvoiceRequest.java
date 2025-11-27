

package org.example.comptabiliteservice.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceRequest {


    private String invoiceType;
    private UUID referenceId;
    private String referenceType;
    private UUID supplierId;
    private UUID customerId;
    private String currency;
    private String paymentMethod;
    private LocalDateTime invoiceDate;


    private Double totalAmount;
    private Double taxAmount;


    private List<InvoiceItemDto> items;
    private List<PaymentDto> payments;
}