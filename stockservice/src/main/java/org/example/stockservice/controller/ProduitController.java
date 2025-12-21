package org.example.stockservice.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.example.stockservice.dto.ProduitDto;
import org.example.stockservice.service.ProduitService;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProduitController {
    private final ProduitService produitService;
    public ProduitController(ProduitService produitService) {
        this.produitService = produitService;
    }
    @GetMapping
    public ResponseEntity<List<ProduitDto>> getAllProduits() {
        return ResponseEntity.ok(produitService.getAllProduits());
    }
    @GetMapping("/{id}")
    public ResponseEntity<ProduitDto> getProduit(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(produitService.getProduitById(id));
    }
    @PostMapping
    public ResponseEntity<ProduitDto> createProduit(@Valid @RequestBody ProduitDto dto) {
        return ResponseEntity.ok(produitService.createProduit(dto));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ProduitDto> updateProduit(
            @PathVariable("id") UUID id,
            @Valid @RequestBody ProduitDto dto) {
        return ResponseEntity.ok(produitService.updateProduit(id, dto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable("id") UUID id) {
        produitService.deleteProduit(id);
        return ResponseEntity.noContent().build();
    }
}