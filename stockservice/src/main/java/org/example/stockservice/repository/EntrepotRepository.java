package org.example.stockservice.repository;
import org.springframework.stereotype.Repository;
import org.example.stockservice.entity.Entrepot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;
@Repository
public interface EntrepotRepository extends JpaRepository<Entrepot, UUID> {
    Optional<Entrepot> findByCode(String code);
    boolean existsByCode(String code);
    boolean existsByCodeAndIdNot(String code, UUID id);
}