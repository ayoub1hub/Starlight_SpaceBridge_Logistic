package org.example.comptabiliteservice.service;

import org.example.comptabiliteservice.dto.ExchangeRateDto;
import org.example.comptabiliteservice.entity.ExchangeRate;
import org.example.comptabiliteservice.mapper.ExchangeRateMapper;
import org.example.comptabiliteservice.repository.ExchangeRateRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ExchangeRateService {

    private final ExchangeRateRepository repository;
    private final ExchangeRateMapper mapper;

    public ExchangeRateService(ExchangeRateRepository repository, ExchangeRateMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public ExchangeRateDto createExchangeRate(ExchangeRateDto dto) {
        ExchangeRate entity = mapper.toEntity(dto);
        entity.setCreatedAt(LocalDateTime.now());
        ExchangeRate saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    public ExchangeRateDto getExchangeRateById(UUID id) {
        ExchangeRate entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exchange Rate not found with ID: " + id));
        return mapper.toDto(entity);
    }

    public List<ExchangeRateDto> getAllExchangeRates() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public ExchangeRateDto updateExchangeRate(UUID id, ExchangeRateDto dto) {
        ExchangeRate existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exchange Rate not found for update with ID: " + id));

        mapper.updateEntityFromDto(dto, existing);
        existing.setUpdatedAt(LocalDateTime.now());

        ExchangeRate updated = repository.save(existing);
        return mapper.toDto(updated);
    }

    public void deleteExchangeRate(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Exchange Rate not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}
