package org.example.commandeservice.controller;

import org.example.commandeservice.dto.SupplierDto;
import org.example.commandeservice.entity.Supplier;
import org.example.commandeservice.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService service;

    public SupplierController(SupplierService service) {
        this.service = service;
    }

    @GetMapping
    public List<SupplierDto> getAll() {
        return service.getAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierDto> getById(@PathVariable UUID id) {
        return service.getById(id)
                .map(supplier -> ResponseEntity.ok(toDto(supplier)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SupplierDto> create(@RequestBody SupplierDto dto) {
        Supplier saved = service.save(toEntity(dto));
        return ResponseEntity.status(201).body(toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierDto> update(@PathVariable UUID id, @RequestBody SupplierDto dto) {
        if (!service.exists(id)) {
            return ResponseEntity.notFound().build();
        }
        Supplier updated = service.update(id, toEntity(dto));
        return ResponseEntity.ok(toDto(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!service.exists(id)) {
            return ResponseEntity.notFound().build();
        }
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // --- Helper methods to convert between Entity and DTO ---
    private SupplierDto toDto(Supplier entity) {
        SupplierDto dto = new SupplierDto();
        dto.setId(entity.getId());
        dto.setCompanyName(entity.getCompanyName());
        dto.setContactEmail(entity.getCompanyContact());
        return dto;
    }

    private Supplier toEntity(SupplierDto dto) {
        Supplier entity = new Supplier();
        entity.setId(dto.getId());
        entity.setCompanyName(dto.getCompanyName());
        entity.setCompanyContact(dto.getContactEmail());
        return entity;
    }
}
