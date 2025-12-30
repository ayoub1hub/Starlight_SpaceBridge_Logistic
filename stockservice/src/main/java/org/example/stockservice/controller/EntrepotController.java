package org.example.stockservice.controller;
import jakarta.validation.Valid;
import org.example.stockservice.dto.*;
import org.example.stockservice.entity.Entrepot;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.stockservice.service.*;
import java.util.List;
import java.util.Map;
import java.util.UUID;
@RestController
@RequestMapping("/api/warehouses")
@CrossOrigin(origins = "*")
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

    @PostMapping("/login")
    public ResponseEntity<?> loginWarehouse(@Valid @RequestBody WarehouseLoginRequest request) {
        Entrepot entrepot = entrepotService.authenticateByCodeAndPassword(
                request.getCode(),
                request.getPassword());

        if (entrepot == null) {
            return ResponseEntity
                    .status(401)
                    .body(Map.of("error", "Code ou mot de passe entrepôt invalide"));
        }

        Map<String, Object> response = Map.of(
                "warehouseId", entrepot.getId(),
                "warehouseCode", entrepot.getCode(),
                "warehouseName", entrepot.getName(),
                "location", entrepot.getLocation(),
                "message", "Entrepôt authentifié avec succès"
        );

        return ResponseEntity.ok(response);
    }
}