// src/main/java/org/example/stockservice/repository/StockRepository.java
package org.example.stockservice.repository;

import org.example.stockservice.entity.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StockRepository extends JpaRepository<Stock, UUID> {

    Optional<Stock> findByEntrepotIdAndProduitId(UUID entrepotId, UUID produitId);

    List<Stock> findByEntrepotId(UUID entrepotId);

    Page<Stock> findByEntrepotId(UUID entrepotId, Pageable pageable);

    long countByEntrepotId(UUID entrepotId);

    long countByEntrepotIdAndQuantityAvailableLessThan(UUID entrepotId, Integer threshold);

    long countByQuantityAvailableLessThan(Integer threshold);

    List<Stock> findByQuantityAvailableLessThan(Integer threshold);

    List<Stock> findByEntrepotIdAndQuantityAvailableLessThan(UUID entrepotId, Integer threshold);
}