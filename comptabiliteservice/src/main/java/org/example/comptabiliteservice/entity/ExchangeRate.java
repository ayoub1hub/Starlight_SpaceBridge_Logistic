package org.example.comptabiliteservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "exchange_rates")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ExchangeRate {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String fromCurrency;
    private String toCurrency;
    private Double rate;
    private LocalDate date;
    private LocalDateTime createdAt = LocalDateTime.now();
}