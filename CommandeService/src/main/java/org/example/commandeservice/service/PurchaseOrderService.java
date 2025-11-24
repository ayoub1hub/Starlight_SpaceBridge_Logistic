package org.example.commandeservice.service;

import com.example.sslproject.commandeservice.entity.PurchaseOrder;
import com.example.sslproject.commandeservice.repository.PurchaseOrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PurchaseOrderService {
    private final PurchaseOrderRepository repository;

    public PurchaseOrderService(PurchaseOrderRepository repository) {
        this.repository = repository;
    }

    public List<PurchaseOrder> getAll() { return repository.findAll(); }
    public Optional<PurchaseOrder> getById(UUID id) { return repository.findById(id); }
    public PurchaseOrder save(PurchaseOrder order) { return repository.save(order); }
    public void delete(UUID id) { repository.deleteById(id); }
}