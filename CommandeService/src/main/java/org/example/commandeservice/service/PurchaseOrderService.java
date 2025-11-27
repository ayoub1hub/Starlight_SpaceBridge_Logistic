// org.example.commandeservice.service.PurchaseOrderService

package org.example.commandeservice.service;

import org.example.commandeservice.dto.PurchaseOrderRequest;
import org.example.commandeservice.dto.PurchaseOrderResponse;
import org.example.commandeservice.entity.PurchaseOrder;
import org.example.commandeservice.mapper.PurchaseOrderMapper;
import org.example.commandeservice.repository.PurchaseOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PurchaseOrderService {
    private final PurchaseOrderRepository repository;
    private final PurchaseOrderMapper mapper;

    public PurchaseOrderService(PurchaseOrderRepository repository, PurchaseOrderMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<PurchaseOrderResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public PurchaseOrderResponse getById(UUID id) {
        PurchaseOrder entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        return mapper.toDto(entity);
    }

    public PurchaseOrderResponse create(PurchaseOrderRequest request) {
        // Convert DTO to Entity
        PurchaseOrder entity = mapper.toEntity(request);

        // Set timestamps if needed
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        // Save Entity
        PurchaseOrder savedEntity = repository.save(entity);

        // Convert saved Entity back to DTO
        return mapper.toDto(savedEntity);
    }

    public PurchaseOrderResponse update(UUID id, PurchaseOrderRequest request) {
        // Find existing entity
        PurchaseOrder existingEntity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found for update with id: " + id));

        // Update existing entity with new data from request
        mapper.updateEntityFromDto(request, existingEntity);

        // Update timestamp
        existingEntity.setUpdatedAt(LocalDateTime.now());

        // Save updated entity
        PurchaseOrder updatedEntity = repository.save(existingEntity);

        // Convert to DTO and return
        return mapper.toDto(updatedEntity);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Order not found for deletion with id: " + id);
        }
        repository.deleteById(id);
    }
}