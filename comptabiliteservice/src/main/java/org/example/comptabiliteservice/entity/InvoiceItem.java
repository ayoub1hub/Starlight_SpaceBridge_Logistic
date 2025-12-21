package org.example.comptabiliteservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "invoice_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    private UUID productId;
    private String description;
    private Integer quantity;
    private Double unitPrice;
    private Double taxRate;
    private Double discountRate;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatesAt;
}