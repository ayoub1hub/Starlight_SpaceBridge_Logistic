package org.example.stockservice.repository;

import com.example.sslproject.stockservice.entity.Entrepot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EntrepotRepository extends JpaRepository<Entrepot, UUID> {}