package stockservice.src.main.java.org.example.stockservice.repository;

import stockservice.src.main.java.org.example.stockservice.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface ProduitRepository extends JpaRepository<Produit, UUID> {}