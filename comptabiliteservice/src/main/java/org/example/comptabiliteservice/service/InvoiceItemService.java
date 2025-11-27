package org.example.comptabiliteservice.service;

import org.example.comptabiliteservice.dto.InvoiceItemDto; // NEW Import
import org.example.comptabiliteservice.entity.InvoiceItem;
import org.example.comptabiliteservice.mapper.InvoiceItemMapper; // NEW Import
import org.example.comptabiliteservice.repository.InvoiceItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
// Optional: If you created a custom exception, use it here instead of RuntimeException
import jakarta.persistence.EntityNotFoundException;


@Service
public class InvoiceItemService {
    private final InvoiceItemRepository repository;
    private final InvoiceItemMapper mapper; // NEW Injection

    // Constructor updated to inject the mapper
    public InvoiceItemService(InvoiceItemRepository repository, InvoiceItemMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    // CHANGED: Returns List<InvoiceItemDto>
    public List<InvoiceItemDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    // CHANGED: Returns InvoiceItemDto, throws exception if not found (consistent with other services)
    public InvoiceItemDto getById(UUID id) {
        InvoiceItem entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice Item not found with ID: " + id));
        return mapper.toDto(entity);
    }

    // CHANGED: Takes InvoiceItemDto, returns InvoiceItemDto
    public InvoiceItemDto save(InvoiceItemDto dto) {
        InvoiceItem entity = mapper.toEntity(dto);
        InvoiceItem savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }

    // CHANGED: Takes InvoiceItemDto, returns InvoiceItemDto
    public InvoiceItemDto update(UUID id, InvoiceItemDto dto) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Invoice Item not found for update with ID: " + id);
        }

        InvoiceItem entity = mapper.toEntity(dto);
        entity.setId(id); // Ensure the existing ID is preserved for update

        // Note: The mapper handles setting the 'invoice' to null via @Mapping(ignore=true),
        // which is correct for updating the item itself.

        InvoiceItem updatedEntity = repository.save(entity);
        return mapper.toDto(updatedEntity);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    // Optional helper method (can be removed if not used by controller)
    // You should consider removing this and relying on exception handling in update/delete.
    public boolean exists(UUID id) {
        return repository.existsById(id);
    }
}