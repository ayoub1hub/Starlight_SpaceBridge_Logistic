package org.example.livraisonservice.dto.external;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockDto {

    private UUID id;

    private UUID entrepotId;

    private UUID produitId;

    private EntrepotSummaryDto entrepot;

    private ProduitSummaryDto produit;

    private Integer quantityAvailable = 0;

    private Integer quantityReserved = 0;

    private Integer minimumStockLevel;

    private Integer reorderLevel;

    private LocalDate lastRestockedAt;

    private LocalDate expiryDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}