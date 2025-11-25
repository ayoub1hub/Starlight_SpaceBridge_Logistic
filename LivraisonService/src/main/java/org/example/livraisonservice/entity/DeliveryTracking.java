package LivraisonService.src.main.java.org.example.livraisonservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "delivery_tracking")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryTracking {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;

    private String status; // e.g. "Picked Up", "In Transit", "Delivered"
    private Double latitude;
    private Double longitude;
    private String notes;

    private LocalDateTime timestamp = LocalDateTime.now();
}