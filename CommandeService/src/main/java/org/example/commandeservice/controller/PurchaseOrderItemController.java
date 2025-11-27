package org.example.commandeservice.controller;

import org.example.commandeservice.entity.PurchaseOrderItem;
import org.example.commandeservice.service.PurchaseOrderItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/purchase-order-items")
public class PurchaseOrderItemController {

    private final PurchaseOrderItemService service;

    public PurchaseOrderItemController(PurchaseOrderItemService service) {
        this.service = service;
    }

    @GetMapping
    public List<PurchaseOrderItem> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderItem> getById(@PathVariable UUID id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderItem> create(@RequestBody PurchaseOrderItem item) {
        PurchaseOrderItem saved = service.save(item);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrderItem> update(
            @PathVariable UUID id,
            @RequestBody PurchaseOrderItem item) {
        if (!service.exists(id)) {
            return ResponseEntity.notFound().build();
        }
        PurchaseOrderItem updated = service.update(id, item);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!service.exists(id)) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}