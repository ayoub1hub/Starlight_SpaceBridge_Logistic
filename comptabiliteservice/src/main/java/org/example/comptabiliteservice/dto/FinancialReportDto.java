

package org.example.comptabiliteservice.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FinancialReportDto {

    private UUID id;
    private String reportType;
    private LocalDate reportDate;

    private Double totalRevenue;
    private Double totalExpenses;
    private Double netProfit;

    private String currency;
    private String generatedBy;
}