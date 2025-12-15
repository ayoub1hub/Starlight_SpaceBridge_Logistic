package org.example.commandeservice.controller;

import org.example.commandeservice.dto.PurchaseOrderItemDto; // Use DTO
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
    public List<PurchaseOrderItemDto> getAll() { // Returns DTO List
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderItemDto> getById(@PathVariable UUID id) {
        PurchaseOrderItemDto item = service.getById(id);
        return ResponseEntity.ok(item);
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderItemDto> create(@RequestBody PurchaseOrderItemDto itemDto) { // Accepts DTO
        PurchaseOrderItemDto saved = service.save(itemDto);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrderItemDto> update(
            @PathVariable UUID id,
            @RequestBody PurchaseOrderItemDto itemDto) { // Accepts DTO

        PurchaseOrderItemDto updated = service.update(id, itemDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}