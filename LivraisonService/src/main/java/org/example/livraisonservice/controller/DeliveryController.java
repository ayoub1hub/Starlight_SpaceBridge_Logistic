package org.example.livraisonservice.controller;

import org.example.livraisonservice.dto.DeliveryDto;
import org.example.livraisonservice.service.DeliveryService;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "*") // à configurer selon besoin
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @PostMapping
    public ResponseEntity<DeliveryDto> createDelivery(@RequestBody DeliveryDto dto) {
        DeliveryDto created = deliveryService.createDelivery(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<DeliveryDto> updateStatus(@PathVariable UUID id, @RequestParam String status) {
        DeliveryDto updated = deliveryService.updateDeliveryStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDto> getDelivery(@PathVariable UUID id) {
        return ResponseEntity.ok(deliveryService.getDeliveryById(id));
    }
}
