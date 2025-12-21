package org.example.livraisonservice.dto.external;

import lombok.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EntrepotSummaryDto {
    private UUID id;
    private String name;
    private String location;
    private String address;
}