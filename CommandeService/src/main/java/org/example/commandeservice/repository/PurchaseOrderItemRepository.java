package org.example.commandeservice.repository;

import org.example.commandeservice.entity.PurchaseOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface PurchaseOrderItemRepository extends JpaRepository<PurchaseOrderItem, UUID> {}