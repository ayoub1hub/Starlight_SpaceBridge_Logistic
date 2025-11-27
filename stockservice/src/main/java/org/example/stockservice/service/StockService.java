package org.example.stockservice.service;

import org.example.stockservice.dto.StockDto;
import org.example.stockservice.entity.Entrepot;
import org.example.stockservice.entity.Produit;
import org.example.stockservice.entity.Stock;
import org.example.stockservice.mapper.StockMapper;
import org.example.stockservice.repository.EntrepotRepository;
import org.example.stockservice.repository.ProduitRepository;
import org.example.stockservice.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class StockService {

    private final StockRepository stockRepository;
    private final EntrepotRepository entrepotRepository;
    private final ProduitRepository produitRepository;
    private final StockMapper stockMapper; // Injected mapper

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

    public List<StockDto> getStockByEntrepot(UUID entrepotId) {
        List<Stock> stocks = stockRepository.findByEntrepotId(entrepotId);
        return stocks.stream()
                .map(stockMapper::toDto)
                .collect(Collectors.toList());
    }

    public StockDto addOrUpdateStock(StockDto dto) {
        Entrepot entrepot = entrepotRepository.findById(dto.getEntrepotId())
                .orElseThrow(() -> new RuntimeException("Entrepôt non trouvé"));
        Produit produit = produitRepository.findById(dto.getProduitId())
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));

        // Map DTO → Entity (relationships handled manually)
        Stock stock = stockMapper.toEntity(dto);
        stock.setEntrepot(entrepot);
        stock.setProduit(produit);

        Stock saved = stockRepository.save(stock);
        return stockMapper.toDto(saved);
    }
}