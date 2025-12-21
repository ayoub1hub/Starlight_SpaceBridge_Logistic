package org.example.commandeservice.controller;

import jakarta.validation.Valid;
import org.example.commandeservice.dto.SupplierDto;
import org.example.commandeservice.entity.Supplier;
import org.example.commandeservice.mapper.SupplierMapper;
import org.example.commandeservice.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService service;
    private final SupplierMapper mapper; // ← Inject the mapper

    public SupplierController(SupplierService service, SupplierMapper mapper) {
        this.service = service;
        this.mapper = mapper;
        System.out.println("SupplierMapper impl: " + mapper.getClass().getName());
    }

    @GetMapping
    public List<SupplierDto> getAll() {
        return service.getAll().stream()
                .map(mapper::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierDto> getById(@PathVariable("id") UUID id) {
        return service.getById(id)
                .map(supplier -> ResponseEntity.ok(mapper.toDto(supplier)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<SupplierDto> create(@Valid @RequestBody SupplierDto dto) {
        Supplier entity = mapper.toEntity(dto); // ← Use mapper
        Supplier saved = service.save(entity);
        return ResponseEntity.status(201).body(mapper.toDto(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierDto> update(@PathVariable("id") UUID id, @Valid @RequestBody SupplierDto dto) {
        if (!service.exists(id)) {
            return ResponseEntity.notFound().build();
        }
        Supplier entity = mapper.toEntity(dto);
        entity.setId(id); // Ensure ID is preserved
        Supplier updated = service.update(id, entity);
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