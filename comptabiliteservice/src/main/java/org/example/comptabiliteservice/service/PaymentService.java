package org.example.comptabiliteservice.service;

import org.example.comptabiliteservice.dto.PaymentDto;
import org.example.comptabiliteservice.entity.Payment;
import org.example.comptabiliteservice.mapper.PaymentMapper;
import org.example.comptabiliteservice.repository.PaymentRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository repository;
    private final PaymentMapper mapper;

    public PaymentService(PaymentRepository repository, PaymentMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public PaymentDto createPayment(PaymentDto dto) {
        Payment entity = mapper.toEntity(dto);
        entity.setCreatedAt(LocalDateTime.now());
        Payment saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    public PaymentDto getPaymentById(UUID id) {
        Payment entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found with ID: " + id));
        return mapper.toDto(entity);
    }

    public List<PaymentDto> getAllPayments() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public PaymentDto updatePayment(UUID id, PaymentDto dto) {
        Payment existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Payment not found for update with ID: " + id));

        mapper.updateEntityFromDto(dto, existing);
        existing.setUpdatedAt(LocalDateTime.now());

        Payment updated = repository.save(existing);
        return mapper.toDto(updated);
    }

    public void deletePayment(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Payment not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}
