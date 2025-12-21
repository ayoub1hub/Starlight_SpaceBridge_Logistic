package org.example.livraisonservice.service;

import org.example.livraisonservice.dto.*;
import org.example.livraisonservice.dto.external.*;
import org.example.livraisonservice.entity.Delivery;
import org.example.livraisonservice.entity.Driver;
import org.example.livraisonservice.mapper.DeliveryMapper;
import org.example.livraisonservice.repository.DeliveryRepository;
import org.example.livraisonservice.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final DriverRepository driverRepository;
    private final DeliveryMapper deliveryMapper;

    private final WebClient webClient;

    @Value("${stockservice.url}")
    private String stockServiceUrl;

    public DeliveryService(
            DeliveryRepository deliveryRepository,
            DriverRepository driverRepository,
            DeliveryMapper deliveryMapper,
            WebClient.Builder webClientBuilder) {
        this.deliveryRepository = deliveryRepository;
        this.driverRepository = driverRepository;
        this.deliveryMapper = deliveryMapper;
        this.webClient = webClientBuilder.build();
    }

    public DeliveryDto createDelivery(DeliveryDto dto) {
        // 1. Assignation automatique d'un driver disponible si non fourni
        UUID driverId;
        if (dto.getDriver() == null || dto.getDriver().getId() == null) {
            driverId = findAvailableDriverId()
                    .orElseThrow(() -> new RuntimeException("Aucun chauffeur disponible trouvé pour la livraison"));
        } else {
            driverId = dto.getDriver().getId();
        }

        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé avec l'ID : " + driverId));

        // 2. Récupérer les infos des produits depuis le stock-service (si besoin)
        enrichDeliveryItems(dto);

        // 3. Mapper et sauvegarder
        Delivery delivery = deliveryMapper.toEntity(dto);
        delivery.setDriver(driver);
        delivery.setDeliveryNumber("DEL-" + System.currentTimeMillis());
        delivery.setStatus("SCHEDULED");
        delivery.setScheduledDate(dto.getScheduledAt() != null
                ? dto.getScheduledAt().toLocalDate()
                : LocalDate.now());
        delivery.setCreatedAt(LocalDateTime.now());
        delivery.setUpdatedAt(LocalDateTime.now());

        Delivery saved = deliveryRepository.save(delivery);
        return deliveryMapper.toDto(saved);
    }

    // Méthode privée pour trouver un driver disponible
    private Optional<UUID> findAvailableDriverId() {
        return driverRepository.findFirstByAvailableTrueAndStatus("Available")
                .map(Driver::getId);
    }

    // Méthode privée pour enrichir les items
    private void enrichDeliveryItems(DeliveryDto dto) {
        for (DeliveryItemDto item : dto.getItems()) {
            if (item.getProductId() != null) {
                try {
                    ProduitSummaryDto produit = webClient
                            .get()
                            .uri(stockServiceUrl + "/api/products/{id}", item.getProductId())                            .retrieve()
                            .bodyToMono(ProduitSummaryDto.class)
                            .block();

                    if (produit != null) {
                        System.out.println(produit.getId());
                        if (item.getProductName() == null) {
                            item.setProductName(produit.getName());
                        }
                        if (item.getUnitPrice() == null) {
                            item.setUnitPrice(BigDecimal.valueOf(produit.getUnitPrice()));
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Erreur lors de la récupération du produit " + item.getProductId() + ": " + e.getMessage());
                }
            }
        }
    }


    public List<DeliveryDto> getAllDeliveries() {
        return deliveryRepository.findAll().stream()
                .map(deliveryMapper::toDto)
                .collect(Collectors.toList());
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

    @Transactional
    public void deleteDelivery(UUID id) {
        if (!deliveryRepository.existsById(id)) {
            throw new RuntimeException("Livraison non trouvée avec l'ID : " + id);
        }
        deliveryRepository.deleteById(id);
    }

}