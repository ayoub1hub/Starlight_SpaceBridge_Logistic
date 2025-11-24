package org.example.commandeservice.entity;


import com.example.sslproject.commandeservice.entity.PurchaseOrder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "customs_declarations")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CustomsDeclaration {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne
    @JoinColumn(name = "purchase_order_id")
    private PurchaseOrder purchaseOrder;

    @Column(nullable = false)
    private String declarationNumber;

    private String customsOffice;
    private LocalDate declarationDate;
    private LocalDate clearanceDate;

    private String status; // e.g. "Pending", "Cleared", "Rejected"

    private Double dutyAmount;
    private Double vatAmount;
    private Double totalCharges;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}