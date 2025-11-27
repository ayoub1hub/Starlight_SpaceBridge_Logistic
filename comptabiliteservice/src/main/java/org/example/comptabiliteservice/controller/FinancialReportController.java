package org.example.comptabiliteservice.controller;

import org.example.comptabiliteservice.dto.FinancialReportDto;
import org.example.comptabiliteservice.service.FinancialReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/financial-reports")
public class FinancialReportController {

    private final FinancialReportService service;

    public FinancialReportController(FinancialReportService service) {
        this.service = service;
    }

    @GetMapping
    public List<FinancialReportDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinancialReportDto> getById(@PathVariable UUID id) {
        FinancialReportDto report = service.getById(id);
        return ResponseEntity.ok(report);
    }

    @PostMapping
    public ResponseEntity<FinancialReportDto> create(@RequestBody FinancialReportDto dto) {
        FinancialReportDto saved = service.save(dto);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinancialReportDto> update(
            @PathVariable UUID id,
            @RequestBody FinancialReportDto dto) {
        FinancialReportDto updated = service.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}