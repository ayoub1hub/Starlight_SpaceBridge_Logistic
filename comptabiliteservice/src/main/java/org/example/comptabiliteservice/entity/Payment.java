package org.example.comptabiliteservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "payments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "invoice_id")
    private Invoice invoice;

    private LocalDateTime paymentDate;
    private Double amountPaid;
    private String currency;
    private String paymentMethod;
    private String transactionReference;

    @Column(columnDefinition = "TEXT")
    private String notes;

    private String receivedBy;
    private LocalDateTime createdAt = LocalDateTime.now();
}
