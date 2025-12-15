package org.example.comptabiliteservice.service;

import org.example.comptabiliteservice.dto.InvoiceItemDto;
import org.example.comptabiliteservice.entity.InvoiceItem;
import org.example.comptabiliteservice.mapper.InvoiceItemMapper;
import org.example.comptabiliteservice.repository.InvoiceItemRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InvoiceItemService {

    private final InvoiceItemRepository repository;
    private final InvoiceItemMapper mapper;

    public InvoiceItemService(InvoiceItemRepository repository, InvoiceItemMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public InvoiceItemDto createInvoiceItem(InvoiceItemDto dto) {
        InvoiceItem entity = mapper.toEntity(dto);
        entity.setCreatedAt(LocalDateTime.now());
        InvoiceItem saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    public InvoiceItemDto getInvoiceItemById(UUID id) {
        InvoiceItem entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice Item not found with ID: " + id));
        return mapper.toDto(entity);
    }

    public List<InvoiceItemDto> getAllInvoiceItems() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public InvoiceItemDto updateInvoiceItem(UUID id, InvoiceItemDto dto) {
        InvoiceItem existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice Item not found for update with ID: " + id));

        mapper.updateEntityFromDto(dto, existing);
        existing.setUpdatedAt(LocalDateTime.now());

        InvoiceItem updated = repository.save(existing);
        return mapper.toDto(updated);
    }

    public void deleteInvoiceItem(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Invoice Item not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}
