package org.example.stockservice.repository;

import com.example.sslproject.stockservice.entity.Produit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface ProduitRepository extends JpaRepository<Produit, UUID> {}