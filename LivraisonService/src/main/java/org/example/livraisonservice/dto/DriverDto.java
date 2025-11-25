package LivraisonService.src.main.java.org.example.livraisonservice.dto;

import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DriverDto {
    private UUID id;
    private String name;
    private String phone;
    private String vehiclePlate;
    private boolean available;
    private Double currentLatitude;
    private Double currentLongitude;
}