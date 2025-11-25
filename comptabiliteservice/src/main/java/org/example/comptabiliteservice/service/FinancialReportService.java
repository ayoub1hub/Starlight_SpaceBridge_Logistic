

package org.example.comptabiliteservice.service;

import org.example.comptabiliteservice.dto.FinancialReportDto;
import org.example.comptabiliteservice.entity.FinancialReport;
import org.example.comptabiliteservice.mapper.FinancialReportMapper;
import org.example.comptabiliteservice.repository.FinancialReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FinancialReportService {
    private final FinancialReportRepository repository;
    private final FinancialReportMapper mapper;


    public FinancialReportService(FinancialReportRepository repository, FinancialReportMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<FinancialReportDto> getAll() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public FinancialReportDto getById(UUID id) {
        FinancialReport entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Financial Report not found"));
        return mapper.toDto(entity);
    }

    public FinancialReportDto save(FinancialReportDto dto) {
        FinancialReport entity = mapper.toEntity(dto);
        FinancialReport savedEntity = repository.save(entity);
        return mapper.toDto(savedEntity);
    }

    public FinancialReportDto update(UUID id, FinancialReportDto dto) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Financial Report not found for update");
        }

        FinancialReport entity = mapper.toEntity(dto);
        entity.setId(id);
        FinancialReport updatedEntity = repository.save(entity);
        return mapper.toDto(updatedEntity);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public boolean exists(UUID id) {
        return repository.existsById(id);
    }
}