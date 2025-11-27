package org.example.stockservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.stockservice.dto.StockDto;
import org.example.stockservice.service.StockService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "*")
public class StockController {

    @Autowired
    private StockService stockService;

    @GetMapping("/entrepot/{entrepotId}")
    public ResponseEntity<List<StockDto>> getStockByEntrepot(@PathVariable UUID entrepotId) {
        return ResponseEntity.ok(stockService.getStockByEntrepot(entrepotId));
    }

    @PostMapping
    public ResponseEntity<StockDto> addOrUpdateStock(@RequestBody StockDto dto) {
        return ResponseEntity.ok(stockService.addOrUpdateStock(dto));
    }
}