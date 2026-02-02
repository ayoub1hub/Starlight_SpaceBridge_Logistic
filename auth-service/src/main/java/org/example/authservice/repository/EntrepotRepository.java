package org.example.authservice.repository;

import org.example.authservice.entity.Entrepot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface EntrepotRepository extends JpaRepository<Entrepot, UUID> {

    Optional<Entrepot> findByCode(String code);

    Boolean existsByCode(String code);
}