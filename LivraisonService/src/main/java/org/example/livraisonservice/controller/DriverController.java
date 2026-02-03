package org.example.livraisonservice.controller;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.example.livraisonservice.dto.DriverDto;
import org.example.livraisonservice.dto.DriverUpdateDto;
import org.example.livraisonservice.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;

import java.security.Principal;
import java.util.*;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    @Autowired
    private DriverService driverService;

    @GetMapping
    public ResponseEntity<List<DriverDto>> getAllDrivers() {
        List<DriverDto> drivers = driverService.getAllDrivers();
        return ResponseEntity.ok(drivers);
    }

    @GetMapping("/me")
    public ResponseEntity<DriverDto> getCurrentDriver(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String personIdStr = principal.getName();
        System.out.println("Utilisateur connecté → personId = " + personIdStr);
        try {
            DriverDto dto = driverService.getCurrentDriverProfile(personIdStr);
            return ResponseEntity.ok(dto);
        } catch (EntityNotFoundException e) {
            System.out.println("Chauffeur non trouvé pour personId: " + personIdStr);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/info")
    public ResponseEntity<DriverDto> updateCurrentDriver(
            @PathVariable("id") UUID id,
            @Valid @RequestBody DriverUpdateDto updateDto) {

        System.out.println("Mise à jour du profil pour personId = " + id);

        try {
            DriverDto updated = driverService.updateDriverProfile(id, updateDto);
            return ResponseEntity.ok(updated);
        } catch (EntityNotFoundException e) {
            System.out.println("Chauffeur non trouvé pour personId: " + id);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DriverDto> getDriver(@PathVariable("id") UUID id) {
        DriverDto driver = driverService.getDriverById(id);
        return ResponseEntity.ok(driver);
    }

    @PostMapping
    public ResponseEntity<DriverDto> createDriver(@Valid @RequestBody DriverDto dto) {
        DriverDto created = driverService.createDriver(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}/location")
    public ResponseEntity<DriverDto> updateLocation(
            @PathVariable("id") UUID id,
            @RequestParam Double lat,
            @RequestParam Double lng) {

        DriverDto updated = driverService.updateDriverLocation(id, lat, lng);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DriverDto> updateStatus(
            @PathVariable("id") UUID id,
            @RequestParam String status) {
        DriverDto updated = driverService.updateDriverStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/available")
    public ResponseEntity<DriverDto> updateAvailable(
            @PathVariable("id") UUID id,
            @RequestBody Map<String, Boolean> request) {  // ou un DTO dédié

        boolean available = request.get("available");
        DriverDto updated = driverService.updateDriverAvailable(id, available);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDriver(@PathVariable("id") UUID id) {
        driverService.deleteDriver(id);
        return ResponseEntity.noContent().build();
    }

}