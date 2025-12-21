package org.example.livraisonservice.repository;

import org.example.livraisonservice.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, UUID> {

    // Méthode utile pour vérifier l'unicité du personId
    boolean existsByPersonId(UUID personId);

    Optional<Driver> findByPersonId(UUID personId);
    Optional<Driver> findFirstByAvailableTrueAndStatus(String status);
}