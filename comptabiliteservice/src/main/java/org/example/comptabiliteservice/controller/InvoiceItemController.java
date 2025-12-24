package org.example.comptabiliteservice.controller;

import org.example.comptabiliteservice.dto.InvoiceItemDto; // CHANGED from entity.InvoiceItem
import org.example.comptabiliteservice.service.InvoiceItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/invoice-items")
public class InvoiceItemController {

    private final InvoiceItemService service;

    public InvoiceItemController(InvoiceItemService service) {
        this.service = service;
    }

    @GetMapping
    // CHANGED: Returns List<InvoiceItemDto>
    public List<InvoiceItemDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    // CHANGED: Returns ResponseEntity<InvoiceItemDto>
    public ResponseEntity<InvoiceItemDto> getById(@PathVariable("id") UUID id) {
        // The service layer now returns the DTO directly or throws an exception
        InvoiceItemDto dto = service.getById(id);
        return ResponseEntity.ok(dto);
    }

    @PostMapping
    // CHANGED: Takes @RequestBody InvoiceItemDto
    public ResponseEntity<InvoiceItemDto> create(@RequestBody InvoiceItemDto dto) {
        InvoiceItemDto saved = service.save(dto);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    // CHANGED: Takes @RequestBody InvoiceItemDto and returns InvoiceItemDto
    public ResponseEntity<InvoiceItemDto> update(
            @PathVariable("id") UUID id,
            @RequestBody InvoiceItemDto dto) {

        // Assuming update method in service handles not found exception/check
        InvoiceItemDto updated = service.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}