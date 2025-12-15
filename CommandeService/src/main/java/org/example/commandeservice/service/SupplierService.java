package org.example.commandeservice.service;

import org.example.commandeservice.dto.SupplierDto; // Change from Entity to DTO
import org.example.commandeservice.entity.Supplier;
import org.example.commandeservice.mapper.SupplierMapper; // New Import
import org.example.commandeservice.repository.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class SupplierService {
    private final SupplierRepository repository;
    private final SupplierMapper mapper; // New field

    public SupplierService(
            SupplierRepository repository,
            SupplierMapper mapper) { // Inject the mapper
        this.repository = repository;
        this.mapper = mapper;
    }

    // Returns DTOs
    public List<SupplierDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto) // Convert Entity to DTO
                .collect(Collectors.toList());
    }

    // Returns DTO
    public SupplierDto getById(UUID id) {
        Supplier entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found with id: " + id));
        return mapper.toDto(entity); // Convert Entity to DTO
    }

    // Accepts DTO and returns DTO
    public SupplierDto save(SupplierDto dto) {
        Supplier entity = mapper.toEntity(dto); // Convert DTO to Entity
        Supplier saved = repository.save(entity);
        return mapper.toDto(saved); // Convert saved Entity back to DTO
    }

    // Accepts DTO and returns DTO
    public SupplierDto update(UUID id, SupplierDto dto) {
        Supplier existingEntity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Supplier not found for update with id: " + id));

        // Note: You should add an update method to SupplierMapper
        // (similar to DeliveryMapper's updateEntityFromDto) and use it here.
        // For simplicity, we'll convert the whole DTO and set the ID.
        Supplier entity = mapper.toEntity(dto);
        entity.setId(id);

        Supplier updated = repository.save(entity);
        return mapper.toDto(updated);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Supplier not found for deletion with id: " + id);
        }
        repository.deleteById(id);
    }
}