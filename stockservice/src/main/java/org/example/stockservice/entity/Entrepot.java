package org.example.stockservice.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
@Entity
@Table(name = "entrepot")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Entrepot {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotBlank
    private String name;
    private String address;
    @NotBlank(message = "Location is required")
    private String location;
    private Double capacity;
    @ManyToOne
    @JoinColumn(name = "respo_id")
    private Person responsable;
    @ManyToOne
    @JoinColumn(name = "admin_id")
    private Person admin;
    @Builder.Default
    private Boolean isActive = true;
    @Builder.Default
    @OneToMany(mappedBy = "entrepot", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Stock> stocks = new ArrayList<>();
    @Builder.Default
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
    // Méthode utilitaire pour maintenir la relation bidirectionnelle
    public void addStock(Stock stock) {
        stocks.add(stock);
        stock.setEntrepot(this);
    }
    public void removeStock(Stock stock) {
        stocks.remove(stock);
        stock.setEntrepot(null);
    }
}