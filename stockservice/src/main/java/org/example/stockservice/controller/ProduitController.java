package stockservice.src.main.java.org.example.stockservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import stockservice.src.main.java.org.example.stockservice.dto.ProduitDto;
import stockservice.src.main.java.org.example.stockservice.service.ProduitService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/produits")
@CrossOrigin(origins = "*")
public class ProduitController {

    @Autowired
    private ProduitService produitService;

    @GetMapping
    public ResponseEntity<List<ProduitDto>> getAllProduits() {
        return ResponseEntity.ok(produitService.getAllProduits());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProduitDto> getProduit(@PathVariable UUID id) {
        return ResponseEntity.ok(produitService.getProduitById(id));
    }

    @PostMapping
    public ResponseEntity<ProduitDto> createProduit(@RequestBody ProduitDto dto) {
        return ResponseEntity.ok(produitService.createProduit(dto));
    }
}