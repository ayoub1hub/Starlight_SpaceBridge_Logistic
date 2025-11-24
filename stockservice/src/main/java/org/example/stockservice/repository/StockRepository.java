package org.example.stockservice.repository;

import com.example.sslproject.stockservice.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface StockRepository extends JpaRepository<Stock, UUID> {}