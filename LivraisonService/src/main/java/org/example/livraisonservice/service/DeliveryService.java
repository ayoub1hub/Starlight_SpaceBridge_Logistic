package org.example.livraisonservice.service;

import org.example.livraisonservice.dto.DeliveryDto;
import org.example.livraisonservice.entity.Delivery;
import org.example.livraisonservice.entity.Driver;
import org.example.livraisonservice.mapper.DeliveryMapper;
import org.example.livraisonservice.repository.DeliveryRepository;
import org.example.livraisonservice.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DriverRepository driverRepository;
    private final DeliveryMapper deliveryMapper;

    public DeliveryService(
            DeliveryRepository deliveryRepository,
            DriverRepository driverRepository,
            DeliveryMapper deliveryMapper) {
        this.deliveryRepository = deliveryRepository;
        this.driverRepository = driverRepository;
        this.deliveryMapper = deliveryMapper;
    }

    public DeliveryDto createDelivery(DeliveryDto dto) {
        if (dto.getDriverId() == null) {
            throw new IllegalArgumentException("Le champ 'driverId' est requis.");
        }

        Driver driver = driverRepository.findById(dto.getDriverId())
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé avec l'ID : " + dto.getDriverId()));

        Delivery delivery = deliveryMapper.toEntity(dto);
        delivery.setDriver(driver);
        delivery.setDeliveryNumber("DEL-" + System.currentTimeMillis());
        delivery.setStatus("SCHEDULED");
        delivery.setScheduledDate(dto.getScheduledAt() != null ?
                dto.getScheduledAt().toLocalDate() : LocalDate.now());
        delivery.setCreatedAt(LocalDateTime.now());

        Delivery saved = deliveryRepository.save(delivery);
        return deliveryMapper.toDto(saved);
    }

    public DeliveryDto getDeliveryById(UUID id) {
        Delivery delivery = deliveryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livraison non trouvée"));
        return deliveryMapper.toDto(delivery);
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
        return deliveryMapper.toDto(updated);
    }
}