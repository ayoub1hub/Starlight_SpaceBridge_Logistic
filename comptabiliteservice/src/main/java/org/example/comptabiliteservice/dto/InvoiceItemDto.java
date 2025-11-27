// org.example.comptabiliteservice.dto.InvoiceItemDto.java

package org.example.comptabiliteservice.dto;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceItemDto {
    private UUID id;
    private UUID productId;
    private String description;
    private Integer quantity;
    private Double unitPrice;
    private Double taxRate;
    private Double discountRate;

}