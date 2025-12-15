package org.example.commandeservice.service;

import org.example.commandeservice.dto.PurchaseOrderRequest;
import org.example.commandeservice.dto.PurchaseOrderResponse;
import org.example.commandeservice.entity.PurchaseOrder;
import org.example.commandeservice.entity.Supplier; // Assuming Entity Name
import org.example.commandeservice.mapper.PurchaseOrderMapper;
import org.example.commandeservice.repository.PurchaseOrderRepository;
import org.example.commandeservice.repository.SupplierRepository; // NEW: Assuming Supplier Repository
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
    private final SupplierRepository supplierRepository; // NEW: Inject Supplier Repository

    public PurchaseOrderService(
            PurchaseOrderRepository repository,
            PurchaseOrderMapper mapper,
            SupplierRepository supplierRepository) { // Inject new dependency
        this.repository = repository;
        this.mapper = mapper;
        this.supplierRepository = supplierRepository;
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
        if (request.getSupplierId() == null) {
            throw new IllegalArgumentException("Le champ 'supplierId' est requis.");
        }

        // 1. Fetch related Entity (matching DeliveryService logic)
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé avec l'ID : " + request.getSupplierId()));

        // 2. Convert DTO to Entity
        PurchaseOrder entity = mapper.toEntity(request);

        // 3. Set complex and computed fields (matching DeliveryService logic)
        entity.setSupplier(supplier);
        entity.setCreatedAt(LocalDateTime.now());
        entity.setUpdatedAt(LocalDateTime.now());

        // You would add logic here to calculate total amount, generate order number, etc.

        // 4. Save Entity
        PurchaseOrder savedEntity = repository.save(entity);

        // 5. Convert saved Entity back to Response DTO
        return mapper.toDto(savedEntity);
    }

    public PurchaseOrderResponse update(UUID id, PurchaseOrderRequest request) {
        // Find existing entity
        PurchaseOrder existingEntity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found for update with id: " + id));

        // 1. Fetch related Entity if ID changed
        if (!existingEntity.getSupplier().getId().equals(request.getSupplierId())) {
            Supplier newSupplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Fournisseur non trouvé avec l'ID : " + request.getSupplierId()));
            existingEntity.setSupplier(newSupplier);
        }

        // 2. Update existing entity with new data from request using mapper
        mapper.updateEntityFromDto(request, existingEntity);

        // 3. Update timestamp and other computed fields
        existingEntity.setUpdatedAt(LocalDateTime.now());

        // 4. Save updated entity
        PurchaseOrder updatedEntity = repository.save(existingEntity);

        // 5. Convert to DTO and return
        return mapper.toDto(updatedEntity);
    }

    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Order not found for deletion with id: " + id);
        }
        repository.deleteById(id);
    }
}