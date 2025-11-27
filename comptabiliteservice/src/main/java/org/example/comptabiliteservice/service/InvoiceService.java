

package org.example.comptabiliteservice.service;

import org.example.comptabiliteservice.dto.InvoiceRequest;
import org.example.comptabiliteservice.dto.InvoiceResponse;
import org.example.comptabiliteservice.entity.Invoice;
import org.example.comptabiliteservice.mapper.InvoiceMapper;
import org.example.comptabiliteservice.repository.InvoiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class InvoiceService {
    private final InvoiceRepository repository;
    private final InvoiceMapper mapper; // NEW Injection


    public InvoiceService(InvoiceRepository repository, InvoiceMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<InvoiceResponse> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public InvoiceResponse getById(UUID id) {
        Invoice entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        return mapper.toDto(entity);
    }

    public InvoiceResponse create(InvoiceRequest request) {
        Invoice entity = mapper.toEntity(request);

        Invoice savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }

    public InvoiceResponse update(UUID id, InvoiceRequest request) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Invoice not found for update");
        }

        Invoice entity = mapper.toEntityForUpdate(id, request);

        Invoice updatedEntity = repository.save(entity);
        return mapper.toDto(updatedEntity);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public boolean exists(UUID id) {
        return repository.existsById(id);
    }
}