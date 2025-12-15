package org.example.comptabiliteservice.service;

import org.example.comptabiliteservice.dto.FinancialReportDto;
import org.example.comptabiliteservice.entity.FinancialReport;
import org.example.comptabiliteservice.mapper.FinancialReportMapper;
import org.example.comptabiliteservice.repository.FinancialReportRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    public FinancialReportDto createFinancialReport(FinancialReportDto dto) {
        FinancialReport entity = mapper.toEntity(dto);
        entity.setCreatedAt(LocalDateTime.now());
        FinancialReport saved = repository.save(entity);
        return mapper.toDto(saved);
    }

    public FinancialReportDto getFinancialReportById(UUID id) {
        FinancialReport entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Financial Report not found with ID: " + id));
        return mapper.toDto(entity);
    }

    public List<FinancialReportDto> getAllFinancialReports() {
        return repository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public FinancialReportDto updateFinancialReport(UUID id, FinancialReportDto dto) {
        FinancialReport existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Financial Report not found for update with ID: " + id));

        mapper.updateEntityFromDto(dto, existing);
        existing.setUpdatedAt(LocalDateTime.now());

        FinancialReport updated = repository.save(existing);
        return mapper.toDto(updated);
    }

    public void deleteFinancialReport(UUID id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Financial Report not found with ID: " + id);
        }
        repository.deleteById(id);
    }
}
