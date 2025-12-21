package org.example.livraisonservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "delivery_proof")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryProof {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    private String photoUrl;
    private String signatureUrl;

    private String recipientName;
    private String recipientIdType;
    private String recipientIdNumber;

    private LocalDateTime deliveredAt;
    private LocalDateTime createdAt = LocalDateTime.now();
}