package LivraisonService.src.main.java.org.example.livraisonservice.service;

import LivraisonService.src.main.java.org.example.livraisonservice.dto.DeliveryDto;
import LivraisonService.src.main.java.org.example.livraisonservice.entity.Delivery;
import LivraisonService.src.main.java.org.example.livraisonservice.entity.Driver;
import LivraisonService.src.main.java.org.example.livraisonservice.repository.DeliveryRepository;
import LivraisonService.src.main.java.org.example.livraisonservice.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private DriverRepository driverRepository;

    public DeliveryDto createDelivery(DeliveryDto dto) {
        if (dto.getDriverId() == null) {
            throw new IllegalArgumentException("Le champ 'driverId' est requis.");
        }

        // Charger le chauffeur (entité)
        Driver driver = driverRepository.findById(dto.getDriverId())
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé avec l'ID : " + dto.getDriverId()));

        // Créer l'entité Delivery à partir du DTO
        Delivery delivery = new Delivery();
        delivery.setId(UUID.randomUUID());
        // On suppose que "reference" = orderReference
        delivery.setOrderReference(dto.getReference());
        // deliveryNumber peut être généré
        delivery.setDeliveryNumber("DEL-" + System.currentTimeMillis());
        delivery.setDriver(driver);
        delivery.setStatus("SCHEDULED");
        delivery.setScheduledDate(dto.getScheduledAt() != null ?
                dto.getScheduledAt().toLocalDate() : LocalDate.now());
        delivery.setDeliveredAt(dto.getDeliveredAt());
        delivery.setCreatedAt(LocalDateTime.now());

        // Vous pouvez ajouter d'autres mappings si besoin (adresse, etc.)
        // delivery.setDeliveryAddress(...);

        Delivery saved = deliveryRepository.save(delivery);
        return mapToDto(saved);
    }

    public DeliveryDto getDeliveryById(UUID id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée"));
        return mapToDto(delivery);
    }

    public DeliveryDto updateDeliveryStatus(UUID id, String status) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée"));

        delivery.setStatus(status);
        if ("DELIVERED".equals(status) && delivery.getDeliveredAt() == null) {
            delivery.setDeliveredAt(LocalDateTime.now());
        }
        delivery.setUpdatedAt(LocalDateTime.now());

        Delivery updated = deliveryRepository.save(delivery);
        return mapToDto(updated);
    }

    // Mapping : Entité → DTO (selon VOTRE structure de DTO)
    private DeliveryDto mapToDto(Delivery entity) {
        DeliveryDto dto = new DeliveryDto();
        dto.setId(entity.getId());
        dto.setReference(entity.getOrderReference()); // ou combiner deliveryNumber + orderReference
        dto.setScheduledAt(entity.getScheduledDate() != null ?
                entity.getScheduledDate().atStartOfDay() : null);
        dto.setDeliveredAt(entity.getDeliveredAt());
        dto.setStatus(entity.getStatus());
        dto.setDriverId(entity.getDriver() != null ? entity.getDriver().getId() : null);
        // routeId : non présent dans l'entité → laisser null ou gérer via un champ supplémentaire
        dto.setRouteId(null);
        // items, proof : à mapper si nécessaire (via repositories dédiés)
        return dto;
    }
}