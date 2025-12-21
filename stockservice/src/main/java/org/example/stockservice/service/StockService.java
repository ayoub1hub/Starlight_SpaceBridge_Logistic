package org.example.stockservice.service;
import org.example.stockservice.dto.*;
import org.example.stockservice.entity.*;
import org.example.stockservice.mapper.StockMapper;
import org.example.stockservice.repository.*;
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
    public List<StockDto> getAllStocks() {
        return stockRepository.findAll().stream()
                .map(stockMapper::toDto)
                .collect(Collectors.toList());
    }
    public StockDto getStockById(UUID id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock non trouvé avec ID: " + id));
        return stockMapper.toDto(stock);
    }
    public List<StockDto> getStockByEntrepot(UUID entrepotId) {
        if (!entrepotRepository.existsById(entrepotId)) {
            throw new RuntimeException("Entrepôt non trouvé avec ID: " + entrepotId);
        }
        return stockRepository.findByEntrepotId(entrepotId).stream()
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
    public void deleteStock(UUID id) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Stock non trouvé"));
        stock.getEntrepot().removeStock(stock);
        stockRepository.deleteById(id);
    }

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