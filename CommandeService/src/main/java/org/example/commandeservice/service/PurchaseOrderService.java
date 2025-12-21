package org.example.commandeservice.service;

import org.example.commandeservice.dto.PurchaseOrderRequest;
import org.example.commandeservice.dto.PurchaseOrderResponse;
import org.example.commandeservice.entity.PurchaseOrder;
import org.example.commandeservice.entity.PurchaseOrderItem;
import org.example.commandeservice.entity.Supplier;
import org.example.commandeservice.mapper.PurchaseOrderMapper;
import org.example.commandeservice.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PurchaseOrderService {

    private final SupplierRepository supplierRepository;
    private final PurchaseOrderRepository repository;
    private final PurchaseOrderMapper mapper;

    public PurchaseOrderService(SupplierRepository supplierRepository, PurchaseOrderRepository repository, PurchaseOrderMapper mapper) {
        this.supplierRepository = supplierRepository;
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<PurchaseOrderResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PurchaseOrderResponse getById(UUID id) {
        PurchaseOrder entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        return mapper.toDto(entity);   // tout est déjà chargé grâce à @EntityGraph
    }

    public PurchaseOrderResponse create(PurchaseOrderRequest request) {
        Supplier supplier = supplierRepository.findById(request.getSupplierId())
                .orElseThrow(() -> new RuntimeException("Supplier not found"));

        PurchaseOrder order = new PurchaseOrder();
        order.setOrderNumber(request.getOrderNumber());
        order.setSupplier(supplier);
        order.setStatus(request.getStatus() != null ? request.getStatus() : "DRAFT");
        order.setExpectedDeliveryDate(request.getExpectedDeliveryDate());

        List<PurchaseOrderItem> items = request.getItems().stream()
                .map(dto -> {
                    PurchaseOrderItem item = new PurchaseOrderItem();
                    item.setProductId(dto.getProductId());
                    item.setQuantity(dto.getQuantity());
                    item.setUnitPrice(dto.getUnitPrice());
                    BigDecimal totalPrice = dto.getUnitPrice()
                            .multiply(BigDecimal.valueOf(dto.getQuantity()));
                    item.setTotalPrice(totalPrice);
                    item.setPurchaseOrder(order);
                    return item;
                })
                .collect(Collectors.toList());

        order.setItems(items);

        BigDecimal total = items.stream()
                .map(item -> item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);

        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        PurchaseOrder saved = repository.save(order);
        return mapper.toDto(saved); // mapper now sets purchaseOrderId automatically
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