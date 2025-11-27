

package org.example.comptabiliteservice.service;

import org.example.comptabiliteservice.dto.PaymentDto;
import org.example.comptabiliteservice.entity.Payment;
import org.example.comptabiliteservice.mapper.PaymentMapper;
import org.example.comptabiliteservice.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {
    private final PaymentRepository repository;
    private final PaymentMapper mapper; // NEW


    public PaymentService(PaymentRepository repository, PaymentMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<PaymentDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public PaymentDto getById(UUID id) {
        Payment entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return mapper.toDto(entity);
    }

    public PaymentDto save(PaymentDto dto) {
        Payment entity = mapper.toEntity(dto);

        Payment savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }

    public PaymentDto update(UUID id, PaymentDto dto) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Payment not found for update");
        }

        Payment entity = mapper.toEntity(dto);
        entity.setId(id);

        Payment updatedEntity = repository.save(entity);
        return mapper.toDto(updatedEntity);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public boolean exists(UUID id) {
        return repository.existsById(id);
    }
}