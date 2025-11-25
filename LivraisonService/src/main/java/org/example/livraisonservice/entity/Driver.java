package LivraisonService.src.main.java.org.example.livraisonservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "drivers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private UUID personId; // linked to Person from another microservice (read-only reference)
    private String licenseNumber;
    private String vehicleType;
    private String vehiclePlateNumber;
    private Double rating;
    private String status; // e.g. "Available", "On Duty", "Inactive"

    private Double currentLatitude;
    private Double currentLongitude;

    private Boolean isActive = true;
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Delivery> deliveries = new ArrayList<>();

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Route> routes = new ArrayList<>();
}