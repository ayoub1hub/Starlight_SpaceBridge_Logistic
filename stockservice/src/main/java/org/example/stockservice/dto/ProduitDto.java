package org.example.stockservice.dto;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ProduitDto {
    private UUID id;
    @NotBlank(message = "SKU is required")
    @Pattern(regexp = "^[A-Z0-9_-]{3,50}$", message = "SKU must be alphanumeric, 3-50 chars")
    private String sku;
    @NotBlank(message = "Name is required")
    private String name;
    @NotBlank(message = "Category is required")
    private String category;
    @NotNull(message = "Unit price is required")
    @DecimalMin(value = "0.01", message = "Price must be positive")
    private Double unitPrice;
    private String description;
    private Double weight;
    private String dimensions;
    private Boolean isHazardous = false;
    private Boolean requiresSpecialHandling = false;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}