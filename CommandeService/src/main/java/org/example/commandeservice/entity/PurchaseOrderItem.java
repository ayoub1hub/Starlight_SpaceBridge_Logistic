package org.example.commandeservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "purchase_order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PurchaseOrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrder;

    private UUID productId; // product ID from warehouse microservice
    private Integer quantityOrdered;
    private Integer quantityReceived;

    private Double unitPrice;
    private Double totalPrice;
    private Double taxAmount;
    private Double discount;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}