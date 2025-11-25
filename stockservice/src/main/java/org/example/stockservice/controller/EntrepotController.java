package stockservice.src.main.java.org.example.stockservice.controller;

import stockservice.src.main.java.org.example.stockservice.entity.Entrepot;
import stockservice.src.main.java.org.example.stockservice.service.EntrepotService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/warehouses")
public class EntrepotController {
    private final EntrepotService entrepotService;

    public EntrepotController(EntrepotService entrepotService) {
        this.entrepotService = entrepotService;
    }

    @GetMapping
    public List<Entrepot> getAll() { return entrepotService.getAll(); }

    @GetMapping("/{id}")
    public Optional<Entrepot> getById(@PathVariable UUID id) { return entrepotService.getById(id); }

    @PostMapping
    public Entrepot create(@RequestBody Entrepot entrepot) { return entrepotService.save(entrepot); }

    @PutMapping("/{id}")
    public Entrepot update(@PathVariable UUID id, @RequestBody Entrepot entrepot) {
        entrepot.setId(id);
        return entrepotService.save(entrepot);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable UUID id) { entrepotService.delete(id); }
}
