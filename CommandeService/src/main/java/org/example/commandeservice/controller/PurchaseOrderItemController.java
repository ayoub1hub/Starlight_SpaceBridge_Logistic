package org.example.commandeservice.controller;

import org.example.commandeservice.dto.PurchaseOrderItemDto;
import org.example.commandeservice.entity.PurchaseOrderItem;
import org.example.commandeservice.mapper.PurchaseOrderItemMapper;
import org.example.commandeservice.service.PurchaseOrderItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/purchase-order-items")
public class PurchaseOrderItemController {

    private final PurchaseOrderItemService service;
    private final PurchaseOrderItemMapper mapper;

    public PurchaseOrderItemController(PurchaseOrderItemService service, PurchaseOrderItemMapper mapper) {
        this.service = service;
        this.mapper = mapper;
    }

    @GetMapping
    public List<PurchaseOrderItemDto> getAll() {
        return service.getAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrderItemDto> getById(@PathVariable("id") UUID id) {
        return service.getById(id)
                .map(item -> ResponseEntity.ok(mapper.toDto(item)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PurchaseOrderItemDto> create(@RequestBody PurchaseOrderItemDto dto) {
        PurchaseOrderItem entity = mapper.toEntity(dto);
        PurchaseOrderItem saved = service.save(entity);
        return ResponseEntity.status(201).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PurchaseOrderItemDto> update(
            @PathVariable("id") UUID id,
            @RequestBody PurchaseOrderItemDto dto) {
        if (!service.exists(id)) {
            return ResponseEntity.notFound().build();
        }
        PurchaseOrderItem entity = mapper.toEntity(dto);
        entity.setId(id); // Preserve ID from path
        PurchaseOrderItem updated = service.update(id, entity);
        return ResponseEntity.ok(mapper.toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        if (!service.exists(id)) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}