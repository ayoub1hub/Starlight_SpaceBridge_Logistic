package org.example.comptabiliteservice.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AddPaymentRequest {
    private LocalDateTime paymentDate;
    private Double amountPaid;
    private String currency;
    private String paymentMethod;
    private String transactionReference;
    private String notes;
    private String receivedBy;
}