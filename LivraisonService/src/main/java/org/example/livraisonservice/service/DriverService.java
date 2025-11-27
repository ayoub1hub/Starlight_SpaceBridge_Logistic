package org.example.livraisonservice.service;

import org.example.livraisonservice.dto.DriverDto;
import org.example.livraisonservice.entity.Driver;
import org.example.livraisonservice.mapper.DriverMapper;
import org.example.livraisonservice.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;

    public DriverService(DriverRepository driverRepository, DriverMapper driverMapper) {
        this.driverRepository = driverRepository;
        this.driverMapper = driverMapper;
    }

    public DriverDto getDriverById(UUID id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chauffeur non trouvé"));
        return driverMapper.toDto(driver);
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
}