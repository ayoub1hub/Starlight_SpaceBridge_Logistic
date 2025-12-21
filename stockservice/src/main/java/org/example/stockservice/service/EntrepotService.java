package org.example.stockservice.service;
import org.example.stockservice.dto.EntrepotDto;
import org.example.stockservice.entity.Entrepot;
import org.example.stockservice.entity.Person;
import org.example.stockservice.mapper.EntrepotMapper;
import org.example.stockservice.repository.EntrepotRepository;
import org.example.stockservice.repository.PersonRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
public class EntrepotService {
    private final EntrepotRepository entrepotRepository;
    private final PersonRepository personRepository;
    private final EntrepotMapper entrepotMapper;
    public EntrepotService(
            EntrepotRepository entrepotRepository,
            PersonRepository personRepository,
            EntrepotMapper entrepotMapper) {
        this.entrepotRepository = entrepotRepository;
        this.personRepository = personRepository;
        this.entrepotMapper = entrepotMapper;
    }
    public List<EntrepotDto> getAllEntrepots() {
        return entrepotRepository.findAll().stream()
                .map(entrepotMapper::toDto)
                .collect(Collectors.toList());
    }
    public EntrepotDto getEntrepotById(UUID id) {
        Entrepot entrepot = entrepotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrepôt non trouvé avec ID: " + id));
        return entrepotMapper.toDto(entrepot);
    }
    public EntrepotDto createEntrepot(EntrepotDto dto) {
        Entrepot entrepot = entrepotMapper.toEntity(dto);
        if (dto.getResponsable() != null && dto.getResponsable().getId() != null) {
            Person responsable = personRepository.findById(dto.getResponsable().getId())
                    .orElseThrow(() -> new RuntimeException("Responsable non trouvé"));
            entrepot.setResponsable(responsable);
        }
        if (dto.getAdmin() != null && dto.getAdmin().getId() != null) {
            Person admin = personRepository.findById(dto.getAdmin().getId())
                    .orElseThrow(() -> new RuntimeException("Admin non trouvé"));
            entrepot.setAdmin(admin);
        }
        Entrepot saved = entrepotRepository.save(entrepot);
        return entrepotMapper.toDto(saved);
    }
    public EntrepotDto updateEntrepot(UUID id, EntrepotDto dto) {
        Entrepot existing = entrepotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrepôt non trouvé avec ID: " + id));
        Entrepot updated = entrepotMapper.toEntity(dto);
        updated.setId(id);
        updated.setCreatedAt(existing.getCreatedAt()); // preserve creation time
        if (dto.getResponsable() != null && dto.getResponsable().getId() != null) {
            Person responsable = personRepository.findById(dto.getResponsable().getId())
                    .orElseThrow(() -> new RuntimeException("Responsable non trouvé"));
            updated.setResponsable(responsable);
        }
        if (dto.getAdmin() != null && dto.getAdmin().getId() != null) {
            Person admin = personRepository.findById(dto.getAdmin().getId())
                    .orElseThrow(() -> new RuntimeException("Admin non trouvé"));
            updated.setAdmin(admin);
        }
        Entrepot saved = entrepotRepository.save(updated);
        return entrepotMapper.toDto(saved);
    }
    public void deleteEntrepot(UUID id) {
        if (!entrepotRepository.existsById(id)) {
            throw new RuntimeException("Entrepôt non trouvé avec ID: " + id);
        }
        entrepotRepository.deleteById(id);
    }
}