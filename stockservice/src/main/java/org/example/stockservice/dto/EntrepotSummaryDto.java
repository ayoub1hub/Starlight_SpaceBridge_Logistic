package org.example.stockservice.dto;
import lombok.*;
import java.util.UUID;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EntrepotSummaryDto {
    private UUID id;
    private String name;
    private String location;
    private String address;
}