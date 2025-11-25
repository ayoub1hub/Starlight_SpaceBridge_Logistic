package org.example.livraisonservice.repository;

import org.example.livraisonservice.entity.DeliveryProof;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DeliveryProofRepository extends JpaRepository<DeliveryProof, UUID> {}