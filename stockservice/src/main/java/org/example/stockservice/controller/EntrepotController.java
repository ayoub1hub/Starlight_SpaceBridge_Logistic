package stockservice.src.main.java.org.example.stockservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import stockservice.src.main.java.org.example.stockservice.dto.EntrepotDto;
import stockservice.src.main.java.org.example.stockservice.service.EntrepotService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/entrepots")
@CrossOrigin(origins = "*")
public class EntrepotController {

    @Autowired
    private EntrepotService entrepotService;

    @GetMapping
    public ResponseEntity<List<EntrepotDto>> getAllEntrepots() {
        return ResponseEntity.ok(entrepotService.getAllEntrepots());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntrepotDto> getEntrepot(@PathVariable UUID id) {
        return ResponseEntity.ok(entrepotService.getEntrepotById(id));
    }

    @PostMapping
    public ResponseEntity<EntrepotDto> createEntrepot(@RequestBody EntrepotDto dto) {
        return ResponseEntity.ok(entrepotService.createEntrepot(dto));
    }
}