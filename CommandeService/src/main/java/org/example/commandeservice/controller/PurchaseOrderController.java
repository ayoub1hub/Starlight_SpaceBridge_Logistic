

package org.example.commandeservice.controller;

import org.example.commandeservice.dto.PurchaseOrderRequest;
import org.example.commandeservice.dto.PurchaseOrderResponse;
import org.example.commandeservice.service.PurchaseOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService service;

    public PurchaseOrderController(PurchaseOrderService service) {
        this.service = service;
    }

    @GetMapping
    public List<PurchaseOrderResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderResponse> getById(@PathVariable("id") UUID id) {
        // Use ResponseEntity for proper HTTP status handling
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    // Consumes DTO, returns DTO
    public ResponseEntity<PurchaseOrderResponse> create(@RequestBody PurchaseOrderRequest request) {
        PurchaseOrderResponse response = service.create(request);
        // Use 201 Created status
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{id}")
    // Consumes DTO, returns DTO
    public ResponseEntity<PurchaseOrderResponse> update(@PathVariable("id") UUID id, @RequestBody PurchaseOrderRequest request) {
        // Service handles the update logic and returns the updated DTO
        PurchaseOrderResponse response = service.update(id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        // Use 204 No Content status for successful deletion
        return ResponseEntity.noContent().build();
    }
}