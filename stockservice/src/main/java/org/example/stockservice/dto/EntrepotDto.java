package org.example.stockservice.dto;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EntrepotDto {
    private UUID id;
    private String code;
    private String password;
    private String name;
    private String location;
    private String address;
    private Double capacity;
    private Boolean isActive = true;
    private PersonDto responsable;
    private PersonDto admin;
    // Liste complète des stocks (en version summary pour éviter boucle)
    private List<StockSummaryDto> stocks = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}