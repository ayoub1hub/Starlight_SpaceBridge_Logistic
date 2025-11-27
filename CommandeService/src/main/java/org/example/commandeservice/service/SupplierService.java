package org.example.commandeservice.service;


import org.example.commandeservice.entity.Supplier;
import org.example.commandeservice.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SupplierService {
    private final SupplierRepository repository;

    public SupplierService(SupplierRepository repository) {
        this.repository = repository;
    }

    public List<Supplier> getAll() {
        return repository.findAll();
    }

    public Optional<Supplier> getById(UUID id) {
        return repository.findById(id);
    }

    public Supplier save(Supplier supplier) {
        return repository.save(supplier);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public Supplier update(UUID id, Supplier supplier) {
        supplier.setId(id);
        return repository.save(supplier);
    }

    public boolean exists(UUID id) {
        return repository.existsById(id);
    }
}