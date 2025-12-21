package org.example.stockservice.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.*;
import java.util.UUID;
@Entity
@Table(name = "stock", uniqueConstraints = @UniqueConstraint(columnNames = {"entrepot_id", "produit_id"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entrepot_id", nullable = false)
    private Entrepot entrepot;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;
    @Column(nullable = false)
    private Integer quantityAvailable = 0;
    private Integer quantityReserved = 0;
    private Integer minimumStockLevel;
    private Integer reorderLevel;
    private LocalDate lastRestockedAt;
    private LocalDate expiryDate;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}