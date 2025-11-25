package stockservice.src.main.java.org.example.stockservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.*;
import java.util.UUID;

@Entity
@Table(name = "stock")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "entrepot_id")
    private Entrepot entrepot;

    @ManyToOne
    @JoinColumn(name = "produit_id")
    private Produit produit;

    private Integer quantityAvailable;
    private Integer quantityReserved;
    private Integer minimumStockLevel;

    private LocalDate lastRestockedAt;
    private LocalDate expiryDate;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}
