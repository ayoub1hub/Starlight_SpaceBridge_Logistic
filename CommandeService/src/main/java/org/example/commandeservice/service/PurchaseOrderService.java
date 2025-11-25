// org.example.commandeservice.service.PurchaseOrderService

package org.example.commandeservice.service;

import org.example.commandeservice.dto.PurchaseOrderRequest;
import org.example.commandeservice.dto.PurchaseOrderResponse;
import org.example.commandeservice.entity.PurchaseOrder;
import org.example.commandeservice.mapper.PurchaseOrderMapper; // New Import
import org.example.commandeservice.repository.PurchaseOrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors; // New Import

@Service
public class PurchaseOrderService {
    private final PurchaseOrderRepository repository;
    private final PurchaseOrderMapper mapper; // New field

    public PurchaseOrderService(PurchaseOrderRepository repository, PurchaseOrderMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<PurchaseOrderResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto) // Convert each Entity to DTO
                .collect(Collectors.toList());
    }

    public PurchaseOrderResponse getById(UUID id) {
        // Find Entity, throw if not found
        PurchaseOrder entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return mapper.toDto(entity); // Convert Entity to DTO
    }

    public PurchaseOrderResponse create(PurchaseOrderRequest request) {
        // 1. Convert DTO to Entity
        PurchaseOrder entity = mapper.toEntity(request);
        // 2. Save Entity
        PurchaseOrder savedEntity = repository.save(entity);
        // 3. Convert saved Entity back to DTO for response
        return mapper.toDto(savedEntity);
    }

    public PurchaseOrderResponse update(UUID id, PurchaseOrderRequest request) {
        // Verify entity exists
        if (!repository.existsById(id)) {
            throw new RuntimeException("Order not found for update");
        }

        // 1. Convert DTO to Entity, ensuring ID is set for update
        PurchaseOrder entity = mapper.toEntityForUpdate(id, request);
        // 2. Save (update) Entity
        PurchaseOrder updatedEntity = repository.save(entity);
        // 3. Convert updated Entity back to DTO for response
        return mapper.toDto(updatedEntity);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}