package org.example.venteservice.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.venteservice.dto.SalesOrderRequest;
import org.example.venteservice.dto.SalesOrderResponse;
import org.example.venteservice.service.SalesOrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/sales-orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SalesOrderController {

    private final SalesOrderService salesOrderService;

    @GetMapping
    public ResponseEntity<List<SalesOrderResponse>> getAll() {
        return ResponseEntity.ok(salesOrderService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SalesOrderResponse> getById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(salesOrderService.getById(id));
    }

    @PostMapping
    public ResponseEntity<SalesOrderResponse> create(@Valid @RequestBody SalesOrderRequest request) {
        return ResponseEntity.status(201).body(salesOrderService.create(request));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<SalesOrderResponse> confirm(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(salesOrderService.confirm(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<SalesOrderResponse> complete(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(salesOrderService.complete(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") UUID id) {
        salesOrderService.delete(id);
        return ResponseEntity.noContent().build();
    }
}