package org.example.commandeservice.service;

import org.example.commandeservice.dto.CustomsDeclarationDto;
import org.example.commandeservice.entity.CustomsDeclaration;
import org.example.commandeservice.mapper.CustomsDeclarationMapper; // New Import
import org.example.commandeservice.repository.CustomsDeclarationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Good practice for service layer

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional // Added for robust data operations
public class CustomsDeclarationService {
    private final CustomsDeclarationRepository repository;
    private final CustomsDeclarationMapper mapper; // New field

    public CustomsDeclarationService(
            CustomsDeclarationRepository repository,
            CustomsDeclarationMapper mapper) { // Inject the mapper
        this.repository = repository;
        this.mapper = mapper;
    }

    // Returns DTOs
    public List<CustomsDeclarationDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto) // Convert Entity to DTO
                .collect(Collectors.toList());
    }

    // Returns DTO
    public CustomsDeclarationDto getById(UUID id) {
        CustomsDeclaration entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customs Declaration not found with id: " + id));
        return mapper.toDto(entity); // Convert Entity to DTO
    }

    // Accepts DTO and returns DTO
    public CustomsDeclarationDto save(CustomsDeclarationDto dto) {
        CustomsDeclaration entity = mapper.toEntity(dto); // Convert DTO to Entity
        CustomsDeclaration saved = repository.save(entity);
        return mapper.toDto(saved); // Convert saved Entity back to DTO
    }

    // Accepts DTO and returns DTO
    public CustomsDeclarationDto update(UUID id, CustomsDeclarationDto dto) {
        CustomsDeclaration existingEntity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customs Declaration not found for update with id: " + id));

        mapper.updateEntityFromDto(dto, existingEntity); // Use MapStruct for update

        CustomsDeclaration updated = repository.save(existingEntity);
        return mapper.toDto(updated);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Customs Declaration not found for deletion with id: " + id);
        }
        repository.deleteById(id);
    }
}