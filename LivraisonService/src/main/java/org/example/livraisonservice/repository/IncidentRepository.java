package org.example.livraisonservice.repository;

import org.example.livraisonservice.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface IncidentRepository extends JpaRepository<Incident, UUID> {
}