package org.example.livraisonservice.controller;

import org.example.livraisonservice.dto.DriverDto;
import org.example.livraisonservice.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin(origins = "*")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @GetMapping("/{id}")
    public ResponseEntity<DriverDto> getDriver(@PathVariable UUID id) {
        DriverDto driver = driverService.getDriverById(id);
        return ResponseEntity.ok(driver);
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<DriverDto> updateLocation(
            @PathVariable UUID id,
            @RequestParam Double lat,
            @RequestParam Double lng) {

        DriverDto updated = driverService.updateDriverLocation(id, lat, lng);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DriverDto> updateStatus(
            @PathVariable UUID id,
            @RequestParam String status) {

        DriverDto updated = driverService.updateDriverStatus(id, status);
        return ResponseEntity.ok(updated);
    }
}