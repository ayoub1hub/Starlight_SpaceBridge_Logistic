package org.example.stockservice.dto;
import lombok.*;
import java.util.UUID;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ProduitSummaryDto {
    private UUID id;
    private String sku;
    private String name;
    private String category;
    private Double unitPrice;
}