// src/main/java/org/example/stockservice/dto/ProduitSummaryDto.java
package org.example.stockservice.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProduitSummaryDto {
    private UUID id;
    private String nom;
    private String sku;
    private String unite;  // unit of measurement (e.g., "pcs", "kg", "liter")
    private BigDecimal prix;
}