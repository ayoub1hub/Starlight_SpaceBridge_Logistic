

package org.example.comptabiliteservice.service;

import org.example.comptabiliteservice.dto.ExchangeRateDto;
import org.example.comptabiliteservice.entity.ExchangeRate;
import org.example.comptabiliteservice.mapper.ExchangeRateMapper;
import org.example.comptabiliteservice.repository.ExchangeRateRepository;
import org.springframework.stereotype.Service;

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

    public List<ExchangeRateDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public ExchangeRateDto getById(UUID id) {
        ExchangeRate entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exchange Rate not found"));
        return mapper.toDto(entity);
    }

    public ExchangeRateDto save(ExchangeRateDto dto) {
        ExchangeRate entity = mapper.toEntity(dto);
        ExchangeRate savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }

    public ExchangeRateDto update(UUID id, ExchangeRateDto dto) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Exchange Rate not found for update");
        }

        ExchangeRate entity = mapper.toEntity(dto);
        entity.setId(id);
        ExchangeRate updatedEntity = repository.save(entity);
        return mapper.toDto(updatedEntity);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public boolean exists(UUID id) {
        return repository.existsById(id);
    }
}