package org.example.commandeservice.service;

import org.example.commandeservice.dto.PurchaseOrderItemDto;
import org.example.commandeservice.entity.PurchaseOrderItem; // Assuming your Entity name
import org.example.commandeservice.mapper.PurchaseOrderItemMapper;
import org.example.commandeservice.repository.PurchaseOrderItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PurchaseOrderItemService {

    private final PurchaseOrderItemRepository repository;
    private final PurchaseOrderItemMapper mapper;

    public PurchaseOrderItemService(
            PurchaseOrderItemRepository repository,
            PurchaseOrderItemMapper mapper) { // Constructor injection
        this.repository = repository;
        this.mapper = mapper;
    }

    /**
     * Retrieves all items and converts them to DTOs.
     */
    public List<PurchaseOrderItemDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto) // Use mapper to convert Entity to DTO
                .collect(Collectors.toList());
    }

    /**
     * Retrieves an item by ID and converts it to a DTO.
     */
    public PurchaseOrderItemDto getById(UUID id) {
        PurchaseOrderItem entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order Item not found with id: " + id));
        return mapper.toDto(entity); // Use mapper to convert Entity to DTO
    }

    /**
     * Accepts a DTO, converts it to an Entity, saves it, and returns the saved DTO.
     */
    public PurchaseOrderItemDto save(PurchaseOrderItemDto dto) {
        PurchaseOrderItem entity = mapper.toEntity(dto); // Convert DTO to Entity

        // NOTE: Business logic (like linking to a PurchaseOrder entity based on purchaseOrderId)
        // should be placed here if necessary, following the DeliveryService pattern.

        PurchaseOrderItem saved = repository.save(entity);
        return mapper.toDto(saved); // Convert saved Entity back to DTO
    }

    /**
     * Updates an existing item using data from the DTO.
     */
    public PurchaseOrderItemDto update(UUID id, PurchaseOrderItemDto dto) {
        // 1. Check existence and retrieve entity
        PurchaseOrderItem existingEntity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase Order Item not found for update with id: " + id));

        // 2. Convert DTO to a temporary entity object
        // (A dedicated MapStruct @MappingTarget update method is ideal, but this works)
        PurchaseOrderItem itemToUpdate = mapper.toEntity(dto);
        itemToUpdate.setId(id); // Ensure the existing ID is maintained

        // 3. Save the changes
        PurchaseOrderItem updated = repository.save(itemToUpdate);

        // 4. Return the updated DTO
        return mapper.toDto(updated);
    }

    /**
     * Deletes an item by ID.
     */
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Purchase Order Item not found for deletion with id: " + id);
        }
        repository.deleteById(id);
    }
}