package org.example.livraisonservice.dto;

import java.math.BigDecimal;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryItemDto {
    private Long productId;
    private String productName;
    private int quantity;
    private BigDecimal unitPrice;
}