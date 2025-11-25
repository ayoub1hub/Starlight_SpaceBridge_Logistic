package stockservice.src.main.java.org.example.stockservice.repository;

import stockservice.src.main.java.org.example.stockservice.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface StockRepository extends JpaRepository<Stock, UUID> {}