package org.example.stockservice.controller;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.stockservice.dto.EntrepotDto;
import org.example.stockservice.service.EntrepotService;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/warehouses")

public class EntrepotController {
    private final EntrepotService entrepotService;

    public EntrepotController(EntrepotService entrepotService) {
        this.entrepotService = entrepotService;
    }

    @GetMapping
    public ResponseEntity<List<EntrepotDto>> getAllEntrepots() {
        return ResponseEntity.ok(entrepotService.getAllEntrepots());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntrepotDto> getEntrepot(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(entrepotService.getEntrepotById(id));
    }

    @PostMapping
    public ResponseEntity<EntrepotDto> createEntrepot(@Valid @RequestBody EntrepotDto dto) {
        return ResponseEntity.ok(entrepotService.createEntrepot(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntrepotDto> updateEntrepot(@PathVariable("id") UUID id,
                                                      @Valid @RequestBody EntrepotDto dto) {
        return ResponseEntity.ok(entrepotService.updateEntrepot(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntrepot(@PathVariable("id") UUID id) {
        entrepotService.deleteEntrepot(id);
        return ResponseEntity.noContent().build();
    }
}
