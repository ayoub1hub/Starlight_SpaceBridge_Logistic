package org.example.livraisonservice.service;

import org.example.livraisonservice.dto.DeliveryTrackingDto;
import org.example.livraisonservice.entity.DeliveryTracking;
import org.example.livraisonservice.repository.DeliveryTrackingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeliveryTrackingService {

    @Autowired
    private DeliveryTrackingRepository trackingRepository;

    /**
     * Enregistre une nouvelle position de suivi pour une livraison donnée.
     * Note : l’ID de l’entité DeliveryTracking est généré automatiquement.
     * deliveryId est l’identifiant de la livraison associée.
     */
    public void recordLocation(UUID deliveryId, Double lat, Double lng, String status) {
        DeliveryTracking tracking = new DeliveryTracking();
        tracking.setId(deliveryId);       // Référence vers la livraison
        tracking.setLatitude(lat);
        tracking.setLongitude(lng);
        tracking.setTimestamp(LocalDateTime.now());
        tracking.setStatus(status);
        trackingRepository.save(tracking);        // ID généré automatiquement (ex: @GeneratedValue)
    }

    /**
     * Récupère tout l’historique de tracking pour une livraison donnée.
     */
    public List<DeliveryTrackingDto> getTrackingHistory(UUID deliveryId) {
        List<DeliveryTracking> trackingList = trackingRepository.findByDeliveryId(deliveryId);
        return trackingList.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Convertit une entité DeliveryTracking en DTO.
     */
    private DeliveryTrackingDto mapToDto(DeliveryTracking entity) {
        DeliveryTrackingDto dto = new DeliveryTrackingDto();
        dto.setId(entity.getId());
        dto.setDeliveryId(entity.getId());
        dto.setLatitude(entity.getLatitude());
        dto.setLongitude(entity.getLongitude());
        dto.setTimestamp(entity.getTimestamp());
        dto.setStatus(entity.getStatus());
        return dto;
    }
}