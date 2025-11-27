package org.example.commandeservice.service;

import org.example.commandeservice.entity.PurchaseOrderItem;
import org.example.commandeservice.repository.PurchaseOrderItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PurchaseOrderItemService {
    private final PurchaseOrderItemRepository repository;

    public PurchaseOrderItemService(PurchaseOrderItemRepository repository) {
        this.repository = repository;
    }

    public List<PurchaseOrderItem> getAll() {
        return repository.findAll();
    }

    public Optional<PurchaseOrderItem> getById(UUID id) {
        return repository.findById(id);
    }

    public PurchaseOrderItem save(PurchaseOrderItem item) {
        return repository.save(item);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public PurchaseOrderItem update(UUID id, PurchaseOrderItem item) {
        item.setId(id);
        return repository.save(item);
    }

    public boolean exists(UUID id) {
        return repository.existsById(id);
    }
}