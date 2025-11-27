package org.example.commandeservice.controller;

import org.example.commandeservice.entity.CustomsDeclaration;
import org.example.commandeservice.service.CustomsDeclarationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/customs-declarations")
public class CustomsDeclarationController {

    private final CustomsDeclarationService service;

    public CustomsDeclarationController(CustomsDeclarationService service) {
        this.service = service;
    }

    @GetMapping
    public List<CustomsDeclaration> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomsDeclaration> getById(@PathVariable UUID id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<CustomsDeclaration> create(@RequestBody CustomsDeclaration declaration) {
        CustomsDeclaration saved = service.save(declaration);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomsDeclaration> update(
            @PathVariable UUID id,
            @RequestBody CustomsDeclaration declaration) {
        if (!service.exists(id)) {
            return ResponseEntity.notFound().build();
        }
        CustomsDeclaration updated = service.update(id, declaration);
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