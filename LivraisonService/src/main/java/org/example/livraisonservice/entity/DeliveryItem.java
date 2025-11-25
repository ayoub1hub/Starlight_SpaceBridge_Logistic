package LivraisonService.src.main.java.org.example.livraisonservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "delivery_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    private UUID productId;
    private Integer quantity;
    private Boolean isDelivered = false;
    private String conditionOnDelivery;
    private String notes;
}