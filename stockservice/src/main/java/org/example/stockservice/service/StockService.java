package org.example.stockservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.stockservice.dto.StockDto;
import org.example.stockservice.entity.Entrepot;
import org.example.stockservice.entity.*;
import org.example.stockservice.repository.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private EntrepotRepository entrepotRepository;

    @Autowired
    private ProduitRepository produitRepository;

    public List<StockDto> getStockByEntrepot(UUID entrepotId) {
        List<Stock> stocks = stockRepository.findByEntrepotId(entrepotId);
        return stocks.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public StockDto addOrUpdateStock(StockDto dto) {
        Entrepot entrepot = entrepotRepository.findById(dto.getEntrepotId())
                .orElseThrow(() -> new RuntimeException("Entrepôt non trouvé"));
        Produit produit = produitRepository.findById(dto.getProduitId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        // Vérifier si un stock existe déjà pour ce couple
        List<Stock> existing = stockRepository.findByEntrepotIdAndProduitId(entrepot.getId(), produit.getId());
        Stock stock = existing.isEmpty() ? new Stock() : existing.get(0);

        stock.setEntrepot(entrepot);
        stock.setProduit(produit);
        stock.setQuantityAvailable(dto.getQuantityAvailable());
        stock.setQuantityReserved(dto.getQuantityReserved());
        stock.setMinimumStockLevel(dto.getMinimumStockLevel());
        stock.setLastRestockedAt(dto.getLastRestockedAt());
        stock.setExpiryDate(dto.getExpiryDate());

        Stock saved = stockRepository.save(stock);
        return mapToDto(saved);
    }

    private StockDto mapToDto(Stock entity) {
        StockDto dto = new StockDto();
        dto.setId(entity.getId());
        dto.setEntrepotId(entity.getEntrepot().getId());
        dto.setProduitId(entity.getProduit().getId());
        dto.setEntrepotName(entity.getEntrepot().getName());
        dto.setProduitName(entity.getProduit().getName());
        dto.setSku(entity.getProduit().getSku());
        dto.setQuantityAvailable(entity.getQuantityAvailable());
        dto.setQuantityReserved(entity.getQuantityReserved());
        dto.setMinimumStockLevel(entity.getMinimumStockLevel());
        dto.setLastRestockedAt(entity.getLastRestockedAt());
        dto.setExpiryDate(entity.getExpiryDate());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}