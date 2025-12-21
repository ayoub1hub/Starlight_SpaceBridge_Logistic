package org.example.comptabiliteservice.controller;

import org.example.comptabiliteservice.dto.ExchangeRateDto;
import org.example.comptabiliteservice.service.ExchangeRateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/exchange-rates")
public class ExchangeRateController {

    private final ExchangeRateService service;

    public ExchangeRateController(ExchangeRateService service) {
        this.service = service;
    }

    @GetMapping
    public List<ExchangeRateDto> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExchangeRateDto> getById(@PathVariable UUID id) {
        ExchangeRateDto exchangeRate = service.getById(id);
        return ResponseEntity.ok(exchangeRate);
    }

    @PostMapping
    public ResponseEntity<ExchangeRateDto> create(@RequestBody ExchangeRateDto dto) {
        ExchangeRateDto saved = service.save(dto);
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExchangeRateDto> update(
            @PathVariable UUID id,
            @RequestBody ExchangeRateDto dto) {
        ExchangeRateDto updated = service.update(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}