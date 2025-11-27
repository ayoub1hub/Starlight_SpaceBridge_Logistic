package org.example.stockservice.service;

import org.example.stockservice.dto.EntrepotDto;
import org.example.stockservice.entity.Entrepot;
import org.example.stockservice.entity.Person;
import org.example.stockservice.mapper.EntrepotMapper;
import org.example.stockservice.repository.EntrepotRepository;
import org.example.stockservice.repository.PersonRepository;
import org.springframework.stereotype.Service;
import org.example.stockservice.dto.EntrepotDto;
import org.example.stockservice.dto.PersonDto;
import org.example.stockservice.entity.*;
import org.example.stockservice.repository.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class EntrepotService {

    private final EntrepotRepository entrepotRepository;
    private final PersonRepository personRepository;
    private final EntrepotMapper entrepotMapper; // Injected mapper

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
                .orElseThrow(() -> new RuntimeException("Entrepôt non trouvé"));
        return entrepotMapper.toDto(entrepot);
    }

    public EntrepotDto createEntrepot(EntrepotDto dto) {
        // Map DTO → Entity (relationships handled manually)
        Entrepot entrepot = entrepotMapper.toEntity(dto);

        if (dto.getResponsable() != null && dto.getResponsable().getId() != null) {
            Person responsable = personRepository.findById(dto.getResponsable().getId())
                    .orElseThrow(() -> new RuntimeException("Responsable non trouvé"));
            entrepot.setResponsable(responsable);
        }

        Entrepot saved = entrepotRepository.save(entrepot);
        return entrepotMapper.toDto(saved);
    }
}