package org.example.livraisonservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.livraisonservice.dto.IncidentRequestDto;
import org.example.livraisonservice.dto.IncidentResponseDto;
import org.example.livraisonservice.service.IncidentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @PostMapping
    public ResponseEntity<IncidentResponseDto> createIncident(
            @Valid @RequestBody IncidentRequestDto request,
            Principal principal,  // userId from JWT
            @RequestHeader("X-Warehouse-Id") UUID warehouseId) {

        String reportedBy = principal.getName(); // ou sub from JWT

        IncidentResponseDto response = incidentService.createIncident(request, reportedBy, warehouseId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/warehouse")
    public ResponseEntity<List<IncidentResponseDto>> getIncidentsByWarehouse(
            @RequestHeader("X-Warehouse-Id") UUID warehouseId) {
        return ResponseEntity.ok(incidentService.getIncidentsByWarehouse(warehouseId));
    }
}