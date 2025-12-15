package org.example.comptabiliteservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "financial_reports")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FinancialReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String reportType; // e.g. "Monthly", "Annual"
    private LocalDate reportDate;

    private Double totalRevenue;
    private Double totalExpenses;
    private Double netProfit;

    private String currency;
    private String generatedBy;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}