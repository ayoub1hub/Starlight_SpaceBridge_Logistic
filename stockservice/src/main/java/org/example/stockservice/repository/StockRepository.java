package org.example.stockservice.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.example.stockservice.entity.Stock;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
@Repository
public interface StockRepository extends JpaRepository<Stock, UUID> {
    List<Stock> findByEntrepotId(UUID entrepotId);
    List<Stock> findByProduitId(UUID produitId);
    // Stock unique par entrepôt + produit
    Optional<Stock> findByEntrepotIdAndProduitId(UUID entrepotId, UUID produitId);
}