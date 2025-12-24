package org.example.comptabiliteservice.dto.external;

import java.time.LocalDateTime;
import java.util.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PurchaseResponse {
    UUID id;
    UUID supplierId;
    String currency;
    String paymentMethod;
    LocalDateTime purchaseDate;
    Double totalAmount;
    Double taxAmount;
    Double discountAmount;
    List<PurchaseItem> items;
}
