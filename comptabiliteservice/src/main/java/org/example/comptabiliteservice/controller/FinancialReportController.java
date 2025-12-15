package org.example.comptabiliteservice.controller;

import org.example.comptabiliteservice.dto.FinancialReportDto;
import org.example.comptabiliteservice.service.FinancialReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/financial-reports")
@CrossOrigin(origins = "*")
public class FinancialReportController {

    private final FinancialReportService service;

    public FinancialReportController(FinancialReportService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<FinancialReportDto> createFinancialReport(@RequestBody FinancialReportDto dto) {
        FinancialReportDto created = service.createFinancialReport(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinancialReportDto> getFinancialReportById(@PathVariable UUID id) {
        FinancialReportDto dto = service.getFinancialReportById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<FinancialReportDto>> getAllFinancialReports() {
        List<FinancialReportDto> list = service.getAllFinancialReports();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinancialReportDto> updateFinancialReport(
            @PathVariable UUID id,
            @RequestBody FinancialReportDto dto) {
        FinancialReportDto updated = service.updateFinancialReport(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFinancialReport(@PathVariable UUID id) {
        service.deleteFinancialReport(id);
        return ResponseEntity.noContent().build();
    }
}
