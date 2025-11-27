package org.example.livraisonservice.service;

import org.example.livraisonservice.dto.DeliveryTrackingDto;
import org.example.livraisonservice.entity.DeliveryTracking;
import org.example.livraisonservice.mapper.DeliveryTrackingMapper;
import org.example.livraisonservice.repository.DeliveryTrackingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeliveryTrackingService {

    private final DeliveryTrackingRepository trackingRepository;
    private final DeliveryTrackingMapper trackingMapper;

    public DeliveryTrackingService(
            DeliveryTrackingRepository trackingRepository,
            DeliveryTrackingMapper trackingMapper) {
        this.trackingRepository = trackingRepository;
        this.trackingMapper = trackingMapper;
    }

    public void recordLocation(UUID deliveryId, Double lat, Double lng, String status) {
        DeliveryTracking tracking = new DeliveryTracking();
        tracking.setId(deliveryId);
        tracking.setLatitude(lat);
        tracking.setLongitude(lng);
        tracking.setTimestamp(LocalDateTime.now());
        tracking.setStatus(status);
        trackingRepository.save(tracking);
    }

    public List<DeliveryTrackingDto> getTrackingHistory(UUID deliveryId) {
        return trackingRepository.findByDeliveryId(deliveryId).stream()
                .map(trackingMapper::toDto)
                .collect(Collectors.toList());
    }
}