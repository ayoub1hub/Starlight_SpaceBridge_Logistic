package org.example.comptabiliteservice.service;

import org.example.comptabiliteservice.entity.InvoiceItem;
import org.example.comptabiliteservice.repository.InvoiceItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvoiceItemService {
    private final InvoiceItemRepository repository;

    public InvoiceItemService(InvoiceItemRepository repository) {
        this.repository = repository;
    }

    public List<InvoiceItem> getAll() { return repository.findAll(); }

    public Optional<InvoiceItem> getById(UUID id) { return repository.findById(id); }

    public InvoiceItem save(InvoiceItem item) { return repository.save(item); }

    public InvoiceItem update(UUID id, InvoiceItem item) {
        item.setId(id);
        return repository.save(item);
    }

    public void delete(UUID id) { repository.deleteById(id); }

    public boolean exists(UUID id) { return repository.existsById(id); }
}
