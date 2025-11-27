// org.example.comptabiliteservice.dto.ExchangeRateDto.java

package org.example.comptabiliteservice.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExchangeRateDto {
    private UUID id;
    private String fromCurrency;
    private String toCurrency;
    private Double rate;
    private LocalDate date;
}