package org.example.stockservice.controller;
import jakarta.validation.Valid;
import org.example.stockservice.dto.external.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.stockservice.dto.*;
import org.example.stockservice.service.StockService;
import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "*")
public class StockController {
    private final StockService stockService;
    public StockController(StockService stockService) {
        this.stockService = stockService;
    }
    @GetMapping
    public ResponseEntity<List<StockDto>> getAllStocks() {
        return ResponseEntity.ok(stockService.getAllStocks());
    }
    @GetMapping("/{id}")
    public ResponseEntity<StockDto> getStock(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(stockService.getStockById(id));
    }
    @GetMapping("/warehouse/{entrepotId}")
    public ResponseEntity<List<StockDto>> getStockByEntrepot(@PathVariable("entrepotId") UUID entrepotId) {
        return ResponseEntity.ok(stockService.getStockByEntrepot(entrepotId));
    }
    @PostMapping
    public ResponseEntity<StockDto> addOrUpdateStock(@Valid @RequestBody StockDto dto) {
        return ResponseEntity.ok(stockService.addOrUpdateStock(dto));
    }

    @PostMapping("/reserve")
    public ResponseEntity<Void> reserveStock(@RequestBody ReserveStockRequest request) {
        stockService.reserveStock(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<StockDto> updateStock(
            @PathVariable("id") UUID id,
            @Valid @RequestBody StockDto dto) {
        return ResponseEntity.ok(stockService.updateStock(id, dto));
    }

    @PostMapping("/receive")
    public ResponseEntity<Void> receiveStock(@RequestBody StockUpdateRequest request) {
        stockService.addStockOnReceive(request.getWarehouseId(), request.getItems());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable("id") UUID id) {
        stockService.deleteStock(id);
        return ResponseEntity.noContent().build();
    }
}