package stockservice.src.main.java.org.example.stockservice.service;

import stockservice.src.main.java.org.example.stockservice.entity.Entrepot;
import stockservice.src.main.java.org.example.stockservice.repository.EntrepotRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class EntrepotService {
    private final EntrepotRepository entrepotRepo;

    public EntrepotService(EntrepotRepository entrepotRepo) {
        this.entrepotRepo = entrepotRepo;
    }

    public List<Entrepot> getAll() { return entrepotRepo.findAll(); }
    public Optional<Entrepot> getById(UUID id) { return entrepotRepo.findById(id); }
    public Entrepot save(Entrepot e) { return entrepotRepo.save(e); }
    public void delete(UUID id) { entrepotRepo.deleteById(id); }
}