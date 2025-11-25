package stockservice.src.main.java.org.example.stockservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import stockservice.src.main.java.org.example.stockservice.entity.Produit;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProduitRepository extends JpaRepository<Produit, UUID> {
    Optional<Produit> findBySku(String sku);
}