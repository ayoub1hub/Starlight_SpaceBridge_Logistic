
package org.example.comptabiliteservice.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceResponse {

    private UUID id;
    private UUID referenceId;
    private String referenceType;
    private String invoiceType;
    private String currency;
    private String status;
    private String paymentMethod;


    private Double totalAmount;
    private Double taxAmount;
    private Double discountAmount;

    private LocalDateTime createdAt;


    private List<InvoiceItemDto> items;
    private List<PaymentDto> payments;
}
