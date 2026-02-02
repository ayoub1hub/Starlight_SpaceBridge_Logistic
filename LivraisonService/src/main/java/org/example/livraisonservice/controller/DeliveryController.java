package org.example.livraisonservice.controller;

import org.example.livraisonservice.dto.DeliveryDto;
import org.example.livraisonservice.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.bind.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "*")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @GetMapping
    public ResponseEntity<List<DeliveryDto>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryService.getAllDeliveries());
    }

    @GetMapping("/my-deliveries")
    public ResponseEntity<List<DeliveryDto>> getMyDeliveries(Principal principal) {
        String driverUsername = principal.getName();
        System.out.println("request my-deliveries for : " + driverUsername);
        try {
            List<DeliveryDto> deliveries = deliveryService.getDeliveriesForDriver(driverUsername);
            return ResponseEntity.ok(deliveries);
        } catch (Exception e) {
            System.err.println("Erreur pour " + driverUsername + " : " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(List.of());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDto> getDelivery(@PathVariable("id") UUID id) {
        DeliveryDto delivery = deliveryService.getDeliveryById(id);
        return ResponseEntity.ok(delivery);
    }

    @PostMapping
    public ResponseEntity<DeliveryDto> createDelivery(@RequestBody DeliveryDto deliveryDto) {
        DeliveryDto created = deliveryService.createDelivery(deliveryDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DeliveryDto> updateDeliveryStatus(
            @PathVariable("id") UUID id,
            @RequestParam("status") String status) {
        DeliveryDto updated = deliveryService.updateDeliveryStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDelivery(@PathVariable("id") UUID id) {
        deliveryService.deleteDelivery(id);
        return ResponseEntity.noContent().build();
    }

}