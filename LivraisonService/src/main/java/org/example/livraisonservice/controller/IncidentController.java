package org.example.livraisonservice.controller;

import jakarta.servlet.annotation.MultipartConfig;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.livraisonservice.dto.IncidentRequestDto;
import org.example.livraisonservice.dto.IncidentResponseDto;
import org.example.livraisonservice.entity.IncidentStatus;
import org.example.livraisonservice.service.IncidentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@Slf4j  // pour 'log'
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<IncidentResponseDto> reportIncident(
            @RequestPart("request") @Valid IncidentRequestDto request,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos,
            Authentication authentication) {

        log.info("Requête incident reçue | deliveryId={} | user={}",
                request.getDeliveryId(), authentication.getName());

        if (photos != null) {
            log.info("Photos reçues : {} fichier(s)", photos.size());
        }

        String driverUsername = authentication.getName();

        IncidentResponseDto response = incidentService.createIncident(
                request,
                driverUsername,
                photos != null ? photos : List.of()
        );

        log.info("Incident créé avec succès | id={}", response.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-incidents")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<IncidentResponseDto>> getMyIncidents(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String driverUsername = authentication.getName();
        List<IncidentResponseDto> incidents = incidentService.getMyIncidents(driverUsername);

        return ResponseEntity.ok(incidents);
    }

    /**
     * Get all incidents for a warehouse (admin/respo)
     */
    @GetMapping("/warehouse/{warehouseId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPO')")
    public ResponseEntity<List<IncidentResponseDto>> getIncidentsByWarehouse(
            @PathVariable UUID warehouseId) {
        List<IncidentResponseDto> incidents = incidentService.getIncidentsByWarehouse(warehouseId);
        return ResponseEntity.ok(incidents);
    }

    /**
     * Update incident status (admin/respo only)
     */
    @PatchMapping("/{incidentId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESPO')")
    public ResponseEntity<IncidentResponseDto> updateIncidentStatus(
            @PathVariable UUID incidentId,
            @RequestParam("status") String statusStr) {

        IncidentStatus newStatus;
        try {
            newStatus = IncidentStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // ou throw exception custom
        }

        IncidentResponseDto updated = incidentService.updateIncidentStatus(incidentId, newStatus);
        return ResponseEntity.ok(updated);
    }

    /**
     * Get single incident details (accessible au reporter ou admin)
     */
    @GetMapping("/{incidentId}")
    public ResponseEntity<IncidentResponseDto> getIncident(
            @PathVariable UUID incidentId,
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        IncidentResponseDto incident = incidentService.getIncidentById(incidentId);
        return ResponseEntity.ok(incident);
    }
}