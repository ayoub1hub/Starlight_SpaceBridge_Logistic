package stockservice.src.main.java.org.example.stockservice.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProduitDto {
    private UUID id;
    private String sku;
    private String name;
    private String description;
    private String category;
    private Double unitPrice;
    private Double weight;
    private String dimensions;
    private Boolean hazardous;
    private Boolean requiresSpecialHandling;
    private LocalDateTime createdAt;
}