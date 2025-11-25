package org.example.livraisonservice.repository;

import org.example.livraisonservice.entity.DeliveryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DeliveryItemRepository extends JpaRepository<DeliveryItem, UUID> {}