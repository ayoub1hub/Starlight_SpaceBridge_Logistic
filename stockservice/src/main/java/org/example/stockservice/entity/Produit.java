package org.example.stockservice.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.stockservice.entity.Stock;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "produit")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String sku;

    private String name;
    private String description;
    private String category;

    private Double unitPrice;
    private Double weight;
    private String dimensions;

    private Boolean isHazardous = false;
    private Boolean requiresSpecialHandling = false;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "produit", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Stock> stocks = new ArrayList<>();
}