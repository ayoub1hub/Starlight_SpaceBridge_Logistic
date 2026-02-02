// src/main/java/org/example/stockservice/dto/StockMetricsDto.java
package org.example.stockservice.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StockMetricsDto {
    private int totalProducts;
    private double totalValue;
    private int lowStockCount;
    private int criticalStockCount;
}