package org.example.comptabiliteservice.dto.external;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SaleResponse {
    UUID id;
    UUID customerId;
    String currency;
    String paymentMethod;
    LocalDateTime saleDate;
    Double totalAmount;
    Double taxAmount;
    Double discountAmount;
    List<SaleItem> items;
}