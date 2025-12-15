package org.example.commandeservice.controller;

import org.example.commandeservice.dto.CustomsDeclarationDto; // Use DTO
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
    public List<CustomsDeclarationDto> getAll() { // Returns DTO List
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomsDeclarationDto> getById(@PathVariable UUID id) {
        // Service methods now throw exceptions for 'Not Found', so we can simplify the handler
        CustomsDeclarationDto declaration = service.getById(id);
        return ResponseEntity.ok(declaration);
    }

    @PostMapping
    public ResponseEntity<CustomsDeclarationDto> create(@RequestBody CustomsDeclarationDto declarationDto) { // Accepts DTO
        CustomsDeclarationDto saved = service.save(declarationDto);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomsDeclarationDto> update(
            @PathVariable UUID id,
            @RequestBody CustomsDeclarationDto declarationDto) { // Accepts DTO

        CustomsDeclarationDto updated = service.update(id, declarationDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}