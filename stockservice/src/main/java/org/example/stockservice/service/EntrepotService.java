package org.example.stockservice.service;
import lombok.RequiredArgsConstructor;
import org.example.stockservice.dto.EntrepotDto;
import org.example.stockservice.entity.Entrepot;
import org.example.stockservice.entity.Person;
import org.example.stockservice.mapper.EntrepotMapper;
import org.example.stockservice.repository.EntrepotRepository;
import org.example.stockservice.repository.PersonRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
@Transactional
public class EntrepotService {
    private final EntrepotRepository entrepotRepository;
    private final PersonRepository personRepository;
    private final EntrepotMapper entrepotMapper;
    private final PasswordEncoder passwordEncoder;


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

        if (entrepotRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Le code '" + dto.getCode() + "' est déjà utilisé.");
        }
        if (dto.getPassword() == null || dto.getPassword().trim().isEmpty()) {
            throw new RuntimeException("Le mot de passe est obligatoire lors de la création.");
        }
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
        entrepot.encodePassword(passwordEncoder);
        Entrepot saved = entrepotRepository.save(entrepot);
        return entrepotMapper.toDto(saved);
    }

    public EntrepotDto updateEntrepot(UUID id, EntrepotDto dto) {
        Entrepot existing = entrepotRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entrepôt non trouvé avec ID: " + id));
        if (!existing.getCode().equals(dto.getCode())) {
            if (entrepotRepository.existsByCode(dto.getCode())) {
                throw new RuntimeException("Le code '" + dto.getCode() + "' est déjà utilisé.");
            }
        }
        entrepotMapper.updateEntity(dto, existing);
        Entrepot saved = entrepotRepository.save(existing);
        return entrepotMapper.toDto(saved);
    }
    public void deleteEntrepot(UUID id) {
        if (!entrepotRepository.existsById(id)) {
            throw new RuntimeException("Entrepôt non trouvé avec ID: " + id);
        }
        entrepotRepository.deleteById(id);
    }
}