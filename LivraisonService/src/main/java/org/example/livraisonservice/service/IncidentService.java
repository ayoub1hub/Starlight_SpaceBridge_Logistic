// src/main/java/org/example/livraisonservice/service/IncidentService.java
package org.example.livraisonservice.service;

import lombok.RequiredArgsConstructor;
import org.example.livraisonservice.dto.IncidentRequestDto;
import org.example.livraisonservice.dto.IncidentResponseDto;
import org.example.livraisonservice.entity.Incident;
import org.example.livraisonservice.mapper.IncidentMapper;
import org.example.livraisonservice.repository.IncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final IncidentMapper incidentMapper;

    public IncidentResponseDto createIncident(IncidentRequestDto request, String reportedBy, UUID warehouseId) {
        // Conversion DTO → Entity via MapStruct
        Incident incident = incidentMapper.toEntity(request);

        // Compléter les champs manquants
        incident.setIncidentCode(generateIncidentCode());
        incident.setReportedBy(reportedBy);
        incident.setWarehouseId(warehouseId);
        incident.setReportedAt(LocalDateTime.now());

        // Sauvegarde
        Incident saved = incidentRepository.save(incident);

        // Conversion Entity → Response DTO
        return incidentMapper.toResponseDto(saved);
    }

    public List<IncidentResponseDto> getIncidentsByWarehouse(UUID warehouseId) {
        return incidentRepository.findAll().stream()
                .filter(i -> warehouseId.equals(i.getWarehouseId()))
                .map(incidentMapper::toResponseDto)
                .toList();
    }

    private String generateIncidentCode() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = incidentRepository.count() + 1;
        return "INC-" + date + "-" + String.format("%04d", count);
    }
}