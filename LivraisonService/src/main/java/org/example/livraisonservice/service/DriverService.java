package org.example.livraisonservice.service;

import lombok.RequiredArgsConstructor;
import org.example.livraisonservice.client.PersonClient;
import org.example.livraisonservice.dto.*;
import org.example.livraisonservice.entity.*;
import org.example.livraisonservice.mapper.*;
import org.example.livraisonservice.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;
    private final PersonClient personClient;  // ← injecté

    public List<DriverDto> getAllDrivers() {
        return driverRepository.findAll().stream()
                .map(this::toEnrichedDto)
                .toList();
    }

    public DriverDto getDriverById(UUID id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé"));
        return toEnrichedDto(driver);
    }

    private DriverDto toEnrichedDto(Driver driver) {
        DriverDto dto = driverMapper.toDto(driver);

        try {
            var person = personClient.getPersonById(driver.getPersonId());
            dto.setName(person.getName());
            dto.setPhone(person.getPhone());
        } catch (Exception e) {
            // En cas de microservice down ou person supprimé
            dto.setName("Personne introuvable");
            dto.setPhone("N/A");
        }

        return dto;
    }

    public DriverDto createDriver(DriverDto dto) {
        if (dto.getPersonId() == null) {
            throw new IllegalArgumentException("personId est obligatoire");
        }

        // Vérifier que le person existe et est un livreur
        try {
            var person = personClient.getPersonById(dto.getPersonId());
            if (!"livreur".equalsIgnoreCase(person.getType())) {
                throw new IllegalArgumentException("La personne doit être de type 'livreur'");
            }
        } catch (Exception e) {
            throw new RuntimeException("Personne non trouvée ou inaccessible dans stockservice");
        }

        // Vérifier unicité personId
        if (driverRepository.existsByPersonId(dto.getPersonId())) {
            throw new IllegalArgumentException("Un driver existe déjà pour cette personne");
        }

        Driver entity = driverMapper.toEntity(dto);
        entity.setPersonId(dto.getPersonId()); // au cas où
        Driver saved = driverRepository.save(entity);
        return toEnrichedDto(saved);
    }

    public DriverDto updateDriverLocation(UUID id, Double latitude, Double longitude) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé"));
        driver.setCurrentLatitude(latitude);
        driver.setCurrentLongitude(longitude);
        driver.setUpdatedAt(LocalDateTime.now());
        return driverMapper.toDto(driverRepository.save(driver));
    }

    public DriverDto updateDriverStatus(UUID id, String status) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé"));
        driver.setStatus(status);
        driver.setUpdatedAt(LocalDateTime.now());
        return driverMapper.toDto(driverRepository.save(driver));
    }

    public DriverDto updateDriverAvailable(UUID id, boolean available) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé avec l'ID : " + id));
        driver.setAvailable(available);
        driver.setUpdatedAt(LocalDateTime.now());
        return driverMapper.toDto(driverRepository.save(driver));
    }

    public void deleteDriver(UUID id) {
        if (!driverRepository.existsById(id)) {
            throw new RuntimeException("Chauffeur non trouvé avec ID: " + id);
        }
        driverRepository.deleteById(id);
    }
}