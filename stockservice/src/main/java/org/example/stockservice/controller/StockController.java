// src/main/java/org/example/stockservice/controller/StockController.java
package org.example.stockservice.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.example.stockservice.dto.*;
import org.example.stockservice.service.StockService;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/stocks")
public class StockController {
    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    // Get all stocks with pagination (FIXED - added @RequestParam)
    @GetMapping
    public ResponseEntity<Page<StockDto>> getAllStocks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size,
            @RequestParam(required = false) String entrepotId) {

        Pageable pageable = PageRequest.of(page, size);

        if (entrepotId != null && !entrepotId.trim().isEmpty()) {
            try {
                UUID entrepotUUID = UUID.fromString(entrepotId);
                Page<StockDto> stocks = stockService.getStocksByEntrepot(entrepotUUID, pageable);
                return ResponseEntity.ok(stocks);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        Page<StockDto> stocks = stockService.getAllStocks(pageable);
        return ResponseEntity.ok(stocks);
    }

    // Get stock by ID
    @GetMapping("/{id}")
    public ResponseEntity<StockDto> getStock(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(stockService.getStockById(id));
    }

    // Get stocks by warehouse/entrepot ID
    @GetMapping("/warehouse/{entrepotId}")
    public ResponseEntity<List<StockDto>> getStockByEntrepot(@PathVariable("entrepotId") UUID entrepotId) {
        return ResponseEntity.ok(stockService.getStockByEntrepot(entrepotId));
    }

    // Metrics endpoint (FIXED - added @RequestParam)
    @GetMapping("/metrics")
    public ResponseEntity<StockMetricsDto> getStockMetrics(
            @RequestParam(required = false) String entrepotId) {

        UUID entrepotUUID = null;
        if (entrepotId != null && !entrepotId.trim().isEmpty()) {
            try {
                entrepotUUID = UUID.fromString(entrepotId);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        StockMetricsDto metrics = stockService.getStockMetrics(entrepotUUID);
        return ResponseEntity.ok(metrics);
    }

    // Low stock items endpoint (FIXED - added @RequestParam)
    @GetMapping("/low-stock")
    public ResponseEntity<List<StockDto>> getLowStockItems(
            @RequestParam(required = false) String entrepotId) {

        UUID entrepotUUID = null;
        if (entrepotId != null && !entrepotId.trim().isEmpty()) {
            try {
                entrepotUUID = UUID.fromString(entrepotId);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        List<StockDto> lowStockItems = stockService.getLowStockItems(entrepotUUID);
        return ResponseEntity.ok(lowStockItems);
    }

    // Add or update stock
    @PostMapping
    public ResponseEntity<StockDto> addOrUpdateStock(@Valid @RequestBody StockDto dto) {
        return ResponseEntity.ok(stockService.addOrUpdateStock(dto));
    }

    // Reserve stock
    @PostMapping("/reserve")
    public ResponseEntity<Void> reserveStock(@RequestBody ReserveStockRequest request) {
        stockService.reserveStock(request);
        return ResponseEntity.ok().build();
    }

    // Update stock
    @PutMapping("/{id}")
    public ResponseEntity<StockDto> updateStock(
            @PathVariable("id") UUID id,
            @Valid @RequestBody StockDto dto) {
        return ResponseEntity.ok(stockService.updateStock(id, dto));
    }

    // Delete stock
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable("id") UUID id) {
        stockService.deleteStock(id);
        return ResponseEntity.noContent().build();
    }




    // CSV Export endpoint
    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportStockToCsv(
            @RequestParam(required = false) String entrepotId) {

        try {
            System.out.println("📊 Exporting stocks to CSV...");

            List<StockDto> stocks;

            if (entrepotId != null && !entrepotId.trim().isEmpty()) {
                UUID entrepotUUID = UUID.fromString(entrepotId);
                System.out.println("📦 Filtering by entrepot: " + entrepotUUID);
                stocks = stockService.getStockByEntrepot(entrepotUUID);
            } else {
                System.out.println("📦 Exporting all stocks");
                stocks = stockService.getAllStocks();
            }

            // Build CSV content
            StringBuilder csvContent = new StringBuilder();

            // Header row
            csvContent.append("Product ID,Product Name,SKU,Warehouse,Available Quantity,Reserved Quantity,Minimum Stock Level,Unit,Last Updated\n");

            // Data rows
            for (StockDto stock : stocks) {
                csvContent.append(escapeCsv(stock.getProduitId() != null ? stock.getProduitId().toString() : ""))
                        .append(",")
                        .append(escapeCsv(stock.getProduit() != null ? stock.getProduit().getNom() : ""))
                        .append(",")
                        .append(escapeCsv(stock.getProduit() != null ? stock.getProduit().getSku() : ""))
                        .append(",")
                        .append(escapeCsv(stock.getEntrepot() != null ? stock.getEntrepot().getNom() : ""))
                        .append(",")
                        .append(stock.getQuantityAvailable())
                        .append(",")
                        .append(stock.getQuantityReserved())
                        .append(",")
                        .append(stock.getMinimumStockLevel())
                        .append(",")
                        .append(escapeCsv(stock.getProduit() != null ? stock.getProduit().getUnite() : "pcs"))
                        .append(",")
                        .append(stock.getUpdatedAt() != null ? stock.getUpdatedAt().toString() : "")
                        .append("\n");
            }

            byte[] csvBytes = csvContent.toString().getBytes(StandardCharsets.UTF_8);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename("stock-export-" + LocalDateTime.now().format(DateTimeFormatter.ISO_DATE) + ".csv")
                    .build());
            headers.setContentLength(csvBytes.length);

            System.out.println("✅ CSV export successful - " + stocks.size() + " items exported");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(csvBytes);

        } catch (Exception e) {
            System.err.println("❌ Error exporting CSV: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    // Helper method to escape CSV values
    private String escapeCsv(String value) {
        if (value == null) {
            return "";
        }
        // Escape double quotes and wrap in quotes if contains comma, quote, or newline
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}