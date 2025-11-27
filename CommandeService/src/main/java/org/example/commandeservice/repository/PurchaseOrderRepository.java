package org.example.commandeservice.repository;

import org.example.commandeservice.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, UUID> {}