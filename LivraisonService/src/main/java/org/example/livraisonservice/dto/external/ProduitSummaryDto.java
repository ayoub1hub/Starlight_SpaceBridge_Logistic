package org.example.livraisonservice.dto.external;

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