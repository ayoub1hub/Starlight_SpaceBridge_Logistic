package org.example.stockservice.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockDto {
    private UUID id;
    private UUID entrepotId;
    private UUID produitId;
    private String entrepotName;   // pour affichage
    private String produitName;    // pour affichage
    private String sku;
    private Integer quantityAvailable;
    private Integer quantityReserved;
    private Integer minimumStockLevel;
    private LocalDate lastRestockedAt;
    private LocalDate expiryDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}