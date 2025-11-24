package org.example.livraisonservice.repository;
import com.example.sslproject.livraisonservice.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DeliveryProofRepository extends JpaRepository<DeliveryProof, UUID> {}