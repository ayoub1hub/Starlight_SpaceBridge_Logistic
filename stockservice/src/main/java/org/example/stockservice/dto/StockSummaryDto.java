package org.example.stockservice.dto;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StockSummaryDto {
    private UUID id;
    private Integer quantityAvailable;
    private Integer quantityReserved;
    private Integer minimumStockLevel;
    private ProduitSummaryDto produit;
}