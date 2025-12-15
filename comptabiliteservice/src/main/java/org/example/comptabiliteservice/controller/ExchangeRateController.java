package org.example.comptabiliteservice.controller;

import org.example.comptabiliteservice.dto.ExchangeRateDto;
import org.example.comptabiliteservice.service.ExchangeRateService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exchange-rates")
@CrossOrigin(origins = "*")
public class ExchangeRateController {

    private final ExchangeRateService service;

    public ExchangeRateController(ExchangeRateService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ExchangeRateDto> createExchangeRate(@RequestBody ExchangeRateDto dto) {
        ExchangeRateDto created = service.createExchangeRate(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExchangeRateDto> getExchangeRateById(@PathVariable UUID id) {
        ExchangeRateDto dto = service.getExchangeRateById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping
    public ResponseEntity<List<ExchangeRateDto>> getAllExchangeRates() {
        List<ExchangeRateDto> list = service.getAllExchangeRates();
        return ResponseEntity.ok(list);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExchangeRateDto> updateExchangeRate(
            @PathVariable UUID id,
            @RequestBody ExchangeRateDto dto) {
        ExchangeRateDto updated = service.updateExchangeRate(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExchangeRate(@PathVariable UUID id) {
        service.deleteExchangeRate(id);
        return ResponseEntity.noContent().build();
    }
}
