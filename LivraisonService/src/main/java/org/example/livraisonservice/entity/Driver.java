package org.example.livraisonservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(
        name = "drivers",
        uniqueConstraints = @UniqueConstraint(columnNames = "personId")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String phone;

    private String licenseNumber;
    private String vehicleType;
    private String vehiclePlateNumber;
    private Double rating;
    private String status; // "Available", "On Duty", "Inactive", etc.

    private Double currentLatitude;
    private Double currentLongitude;

    private Boolean available = true;

    @Column(unique = true, nullable = false)
    private UUID personId;

    private LocalDateTime createdAt;
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

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Route> routes = new ArrayList<>();

    public void updateLocation(Double lat, Double lon) {
        this.currentLatitude = lat;
        this.currentLongitude = lon;
        this.updatedAt = LocalDateTime.now();
    }
}