package org.example.livraisonservice.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.livraisonservice.dto.IncidentRequestDto;
import org.example.livraisonservice.dto.IncidentResponseDto;
import org.example.livraisonservice.entity.Delivery;
import org.example.livraisonservice.entity.Driver;
import org.example.livraisonservice.entity.Incident;
import org.example.livraisonservice.entity.IncidentStatus;
import org.example.livraisonservice.entity.IncidentType;
import org.example.livraisonservice.entity.SeverityLevel;
import org.example.livraisonservice.incidentImages.FileStorageService;
import org.example.livraisonservice.mapper.IncidentMapper;
import org.example.livraisonservice.repository.DeliveryRepository;
import org.example.livraisonservice.repository.DriverRepository;
import org.example.livraisonservice.repository.IncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final DeliveryRepository deliveryRepository;
    private final DriverRepository driverRepository;
    private final IncidentMapper incidentMapper;
    private final FileStorageService fileStorageService;

    /**
     * Crée un nouvel incident signalé par un chauffeur
     */
    public IncidentResponseDto createIncident(
            IncidentRequestDto request,
            String driverUsername,
            List<MultipartFile> photos) {

        log.info("Création incident | deliveryId={} | reportedBy={}",
                request.getDeliveryId(), driverUsername);

        // Le "driverUsername" est en fait le personId (UUID String) venant du JWT
        UUID personId = UUID.fromString(driverUsername);

        Driver driver = driverRepository.findByPersonId(personId)
                .orElseThrow(() -> new IllegalArgumentException("Chauffeur non trouvé pour personId : " + personId));

        Delivery delivery = deliveryRepository.findById(request.getDeliveryId())
                .orElseThrow(() -> {
                    log.warn("Livraison non trouvée : {}", request.getDeliveryId());
                    return new IllegalArgumentException("Livraison non trouvée");
                });

        if (delivery.getDriver() == null || !driver.getId().equals(delivery.getDriver().getId())) {
            log.warn("Tentative incident non autorisée | delivery={} | driver={}",
                    delivery.getId(), driver.getId());
            throw new SecurityException("Vous n'êtes pas assigné à cette livraison");
        }

        Incident incident = incidentMapper.toEntity(request);

        // 5. Compléter les champs obligatoires
        incident.setId(UUID.randomUUID());
        incident.setIncidentCode(generateIncidentCode());
        incident.setDeliveryId(request.getDeliveryId());
        incident.setReportedBy(driverUsername);
        incident.setDriverId(driver.getId());
        incident.setWarehouseId(delivery.getWarehouseId());
        incident.setReportedAt(LocalDateTime.now());
        incident.setStatus(IncidentStatus.OPEN);
        incident.setSeverity(request.getSeverity() != null ? request.getSeverity() : SeverityLevel.MEDIUM);

        // Conversion du type String → enum IncidentType
        if (request.getType() != null) {
            try {
                incident.setType(IncidentType.valueOf(request.getType().toUpperCase()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException("Type d'incident invalide : " + request.getType());
            }
        } else {
            throw new IllegalArgumentException("Le type d'incident est obligatoire");
        }

        // 6. Gestion des photos (upload)
        if (photos != null && !photos.isEmpty()) {
            List<String> photoUrls = photos.stream()
                    .map(file -> {
                        try {
                            return fileStorageService.uploadFile(file, "incidents/" + incident.getId());
                        } catch (IOException e) {
                            throw new RuntimeException("Échec upload photo : " + file.getOriginalFilename(), e);
                        }
                    })
                    .collect(Collectors.toList());
            incident.setPhotoUrls(photoUrls);
        }



        log.debug("Photos à uploader : {} fichier(s)", photos.size());

        if (photos != null && !photos.isEmpty()) {
            List<String> urls = photos.stream()
                    .map(file -> {
                        try {
                            String url = fileStorageService.uploadFile(file, "incidents/" + incident.getId());
                            log.debug("Photo uploadée : {}", url);
                            return url;
                        } catch (IOException e) {
                            log.error("Échec upload photo : {}", file.getOriginalFilename(), e);
                            throw new RuntimeException("Échec upload photo", e);
                        }
                    })
                    .collect(Collectors.toList());
            incident.setPhotoUrls(urls);
        }

        Incident saved = incidentRepository.save(incident);
        log.info("Incident sauvegardé | id={} | code={}", saved.getId(), saved.getIncidentCode());

        return incidentMapper.toResponseDto(saved);
    }

    /**
     * Liste des incidents signalés par le chauffeur connecté
     */
    @Transactional(readOnly = true)
    public List<IncidentResponseDto> getMyIncidents(String driverUsername) {
        Driver driver = driverRepository.findByName(driverUsername)
                .orElseThrow(() -> new IllegalArgumentException("Chauffeur non trouvé"));

        return incidentRepository.findByDriverId(driver.getId())
                .stream()
                .map(incidentMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Liste des incidents pour un entrepôt (admin/respo)
     */
    @Transactional(readOnly = true)
    public List<IncidentResponseDto> getIncidentsByWarehouse(UUID warehouseId) {
        return incidentRepository.findByWarehouseId(warehouseId)
                .stream()
                .map(incidentMapper::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Récupère un incident par ID
     */
    @Transactional(readOnly = true)
    public IncidentResponseDto getIncidentById(UUID incidentId) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new IllegalArgumentException("Incident non trouvé : " + incidentId));

        return incidentMapper.toResponseDto(incident);
    }

    /**
     * Met à jour le statut d'un incident (admin/respo)
     */
    public IncidentResponseDto updateIncidentStatus(UUID incidentId, IncidentStatus newStatus) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new IllegalArgumentException("Incident non trouvé"));

        incident.setStatus(newStatus);
        incident.setUpdatedAt(LocalDateTime.now());

        if (newStatus == IncidentStatus.RESOLVED || newStatus == IncidentStatus.REJECTED) {
            incident.setResolvedAt(LocalDateTime.now());
        }

        Incident updated = incidentRepository.save(incident);
        return incidentMapper.toResponseDto(updated);
    }

    // Génération de code unique (sécurisé contre collision)
    private String generateIncidentCode() {
        String prefix = "INC-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long countToday = incidentRepository.countByIncidentCodeStartingWith(prefix);
        return prefix + "-" + String.format("%04d", countToday + 1);
    }
}