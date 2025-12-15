package org.example.comptabiliteservice.service;

import org.example.comptabiliteservice.dto.InvoiceRequest;
import org.example.comptabiliteservice.dto.InvoiceResponse;
import org.example.comptabiliteservice.entity.Invoice;
import org.example.comptabiliteservice.mapper.InvoiceMapper;
import org.example.comptabiliteservice.repository.InvoiceRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InvoiceService {

    private final InvoiceRepository repository;
    private final InvoiceMapper mapper;

    public InvoiceService(InvoiceRepository repository, InvoiceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public InvoiceResponse createInvoice(InvoiceRequest request) {
        Invoice entity = mapper.toEntity(request);
        entity.setCreatedAt(LocalDateTime.now());
        Invoice saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    public InvoiceResponse getInvoiceById(UUID id) {
        Invoice entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found with ID: " + id));
        return mapper.toDto(entity);
    }

    public List<InvoiceResponse> getAllInvoices() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public InvoiceResponse updateInvoice(UUID id, InvoiceRequest request) {
        Invoice existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Invoice not found for update with ID: " + id));

        Invoice updatedEntity = mapper.toEntityForUpdate(id, request);
        updatedEntity.setUpdatedAt(LocalDateTime.now());

        Invoice saved = repository.save(updatedEntity);
        return mapper.toDto(saved);
    }

    public void deleteInvoice(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Invoice not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}
