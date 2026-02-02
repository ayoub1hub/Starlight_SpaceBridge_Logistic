// src/main/java/org/example/stockservice/service/StockService.java
package org.example.stockservice.service;

import org.example.stockservice.dto.*;
import org.example.stockservice.entity.*;
import org.example.stockservice.mapper.StockMapper;
import org.example.stockservice.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StockService {
    private final StockRepository stockRepository;
    private final EntrepotRepository entrepotRepository;
    private final ProduitRepository produitRepository;
    private final StockMapper stockMapper;

    public StockService(
            StockRepository stockRepository,
            EntrepotRepository entrepotRepository,
            ProduitRepository produitRepository,
            StockMapper stockMapper) {
        this.stockRepository = stockRepository;
        this.entrepotRepository = entrepotRepository;
        this.produitRepository = produitRepository;
        this.stockMapper = stockMapper;
    }

    // NEW: Get all stocks with pagination
    public Page<StockDto> getAllStocks(Pageable pageable) {
        return stockRepository.findAll(pageable).map(stockMapper::toDto);
    }

    // NEW: Get stocks by entrepot with pagination
    public Page<StockDto> getStocksByEntrepot(UUID entrepotId, Pageable pageable) {
        if (!entrepotRepository.existsById(entrepotId)) {
            throw new RuntimeException("Entrepôt non trouvé avec ID: " + entrepotId);
        }
        return stockRepository.findByEntrepotId(entrepotId, pageable).map(stockMapper::toDto);
    }

    // Existing method - keep as is
    public List<StockDto> getAllStocks() {
        return stockRepository.findAll().stream()
                .map(stockMapper::toDto)
                .collect(Collectors.toList());
    }

    // Existing method - keep as is
    public StockDto getStockById(UUID id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock non trouvé avec ID: " + id));
        return stockMapper.toDto(stock);
    }

    // Existing method - keep as is
    public List<StockDto> getStockByEntrepot(UUID entrepotId) {
        if (!entrepotRepository.existsById(entrepotId)) {
            throw new RuntimeException("Entrepôt non trouvé avec ID: " + entrepotId);
        }
        return stockRepository.findByEntrepotId(entrepotId).stream()
                .map(stockMapper::toDto)
                .collect(Collectors.toList());
    }

    // NEW: Get stock metrics
    // Replace your getStockMetrics method in StockService.java with this:

    public StockMetricsDto getStockMetrics(UUID entrepotId) {
        try {
            System.out.println("📊 ========================================");
            System.out.println("📊 Getting metrics for entrepotId: " + entrepotId);

            long totalProducts;
            long lowStockCount;
            long criticalStockCount;
            double totalValue = 0.0;  // We'll set this to 0 since we don't have price data

            if (entrepotId != null) {
                System.out.println("🔍 Filtering by entrepot: " + entrepotId);

                totalProducts = stockRepository.countByEntrepotId(entrepotId);
                System.out.println("✅ Total products: " + totalProducts);

                lowStockCount = stockRepository.countByEntrepotIdAndQuantityAvailableLessThan(entrepotId, 10);
                System.out.println("⚠️ Low stock count: " + lowStockCount);

                criticalStockCount = stockRepository.countByEntrepotIdAndQuantityAvailableLessThan(entrepotId, 5);
                System.out.println("🔴 Critical stock count: " + criticalStockCount);

            } else {
                System.out.println("🔍 Getting metrics for ALL entrepots");

                totalProducts = stockRepository.count();
                System.out.println("✅ Total products: " + totalProducts);

                lowStockCount = stockRepository.countByQuantityAvailableLessThan(10);
                System.out.println("⚠️ Low stock count: " + lowStockCount);

                criticalStockCount = stockRepository.countByQuantityAvailableLessThan(5);
                System.out.println("🔴 Critical stock count: " + criticalStockCount);
            }

            // For now, totalValue is 0 since we don't have price information
            // You can add this later when you add price field to Produit
            System.out.println("💰 Total value: " + totalValue + " (price calculation not available)");

            StockMetricsDto metrics = StockMetricsDto.builder()
                    .totalProducts((int) totalProducts)
                    .totalValue(totalValue)
                    .lowStockCount((int) lowStockCount)
                    .criticalStockCount((int) criticalStockCount)
                    .build();

            System.out.println("✅ Metrics built successfully!");
            System.out.println("📊 ========================================");

            return metrics;

        } catch (Exception e) {
            System.err.println("❌ ========================================");
            System.err.println("❌ ERROR in getStockMetrics!");
            System.err.println("❌ EntrepotId: " + entrepotId);
            System.err.println("❌ Error message: " + e.getMessage());
            System.err.println("❌ Error class: " + e.getClass().getName());
            e.printStackTrace();
            System.err.println("❌ ========================================");

            // Return empty metrics instead of crashing
            return StockMetricsDto.builder()
                    .totalProducts(0)
                    .totalValue(0.0)
                    .lowStockCount(0)
                    .criticalStockCount(0)
                    .build();
        }
    }

    // NEW: Get low stock items
    public List<StockDto> getLowStockItems(UUID entrepotId) {
        List<Stock> lowStockList;

        if (entrepotId != null) {
            lowStockList = stockRepository.findByEntrepotIdAndQuantityAvailableLessThan(entrepotId, 10);
        } else {
            lowStockList = stockRepository.findByQuantityAvailableLessThan(10);
        }

        return lowStockList.stream()
                .map(stockMapper::toDto)
                .collect(Collectors.toList());
    }

    private void validateRelations(StockDto dto) {
        if (dto.getEntrepotId() == null) {
            throw new IllegalArgumentException("Entrepot ID is required");
        }
        if (dto.getProduitId() == null) {
            throw new IllegalArgumentException("Produit ID is required");
        }
        if (!entrepotRepository.existsById(dto.getEntrepotId())) {
            throw new RuntimeException("Entrepot not found with ID: " + dto.getEntrepotId());
        }
        if (!produitRepository.existsById(dto.getProduitId())) {
            throw new RuntimeException("Produit not found with ID: " + dto.getProduitId());
        }
    }

    // Existing method - keep as is
    public StockDto addOrUpdateStock(StockDto dto) {
        validateRelations(dto);
        Optional<Stock> existing = stockRepository.findByEntrepotIdAndProduitId(dto.getEntrepotId(), dto.getProduitId());
        if (existing.isPresent()) {
            Stock stock = existing.get();
            stockMapper.updateStockFromDto(dto, stock);
            stock.setUpdatedAt(LocalDateTime.now());
            Stock saved = stockRepository.save(stock);
            return stockMapper.toDto(saved);
        } else {
            Stock stock = stockMapper.toEntity(dto);
            Entrepot entrepot = entrepotRepository.getReferenceById(dto.getEntrepotId());
            Produit produit = produitRepository.getReferenceById(dto.getProduitId());
            stock.setEntrepot(entrepot);
            stock.setProduit(produit);
            entrepot.addStock(stock);
            Stock saved = stockRepository.save(stock);
            return stockMapper.toDto(saved);
        }
    }

    // Existing method - keep as is
    public StockDto updateStock(UUID id, StockDto dto) {
        Stock existing = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock non trouvé"));
        stockMapper.updateStockFromDto(dto, existing);
        existing.setUpdatedAt(LocalDateTime.now());

        // Mettre à jour les relations si IDs fournis
        if (dto.getEntrepotId() != null) {
            Entrepot newEntrepot = entrepotRepository.getReferenceById(dto.getEntrepotId());
            if (!newEntrepot.getId().equals(existing.getEntrepot().getId())) {
                existing.getEntrepot().removeStock(existing);
                newEntrepot.addStock(existing);
                existing.setEntrepot(newEntrepot);
            }
        }
        if (dto.getProduitId() != null) {
            Produit newProduit = produitRepository.getReferenceById(dto.getProduitId());
            existing.setProduit(newProduit);
        }
        Stock saved = stockRepository.save(existing);
        return stockMapper.toDto(saved);
    }

    // Existing method - keep as is
    public void deleteStock(UUID id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock non trouvé"));
        stock.getEntrepot().removeStock(stock);
        stockRepository.deleteById(id);
    }

    // Existing method - keep as is
    @Transactional
    public void reserveStock(ReserveStockRequest request) {
        for (ReserveStockItem item : request.getItems()) {
            Stock stock = stockRepository.findByEntrepotIdAndProduitId(request.getWarehouseId(), item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Stock non trouvé"));

            if (stock.getQuantityAvailable() < item.getQuantity()) {
                throw new RuntimeException("Stock insuffisant pour " + item.getProductId());
            }

            stock.setQuantityAvailable(stock.getQuantityAvailable() - item.getQuantity());
            stock.setQuantityReserved(stock.getQuantityReserved() + item.getQuantity());
            stockRepository.save(stock);
        }
    }
}