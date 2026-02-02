// src/main/java/org/example/stockservice/dto/EntrepotSummaryDto.java
package org.example.stockservice.dto;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EntrepotSummaryDto {
    private UUID id;
    private String nom;      // Warehouse name (French)
    private String adresse;  // Warehouse address (French)
}