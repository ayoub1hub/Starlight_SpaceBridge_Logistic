package org.example.stockservice.dto;
import lombok.*;
import java.time.LocalDate;
import java.util.UUID;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockSummaryDto {
    private UUID id;
    private ProduitSummaryDto produit;
    private Integer quantityAvailable;
    private Integer quantityReserved;
    private Integer minimumStockLevel;
    private Integer reorderLevel;
    private LocalDate lastRestockedAt;
    private LocalDate expiryDate;
}