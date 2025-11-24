package org.example.comptabiliteservice.entity;

import com.example.sslproject.comptabiliteservice.entity.InvoiceItem;
import com.example.sslproject.comptabiliteservice.entity.Payment;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "invoices")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String invoiceType;      // e.g. "Supplier", "Customer"
    private UUID referenceId;        // link to purchase order or delivery
    private String referenceType;    // "PurchaseOrder" or "Delivery"

    private UUID supplierId;
    private UUID customerId;

    private Double taxAmount;
    private Double discountAmount;
    private Double totalAmount;
    private String currency;
    private String status;           // e.g. "Paid", "Pending", "Cancelled"
    private String paymentMethod;    // e.g. "Bank Transfer", "Credit"

    @Column(columnDefinition = "TEXT")
    private String notes;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Payment> payments = new ArrayList<>();
}