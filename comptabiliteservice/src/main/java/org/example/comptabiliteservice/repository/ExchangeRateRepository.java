package org.example.comptabiliteservice.repository;
import org.example.comptabiliteservice.entity.ExchangeRate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRate, UUID> {}