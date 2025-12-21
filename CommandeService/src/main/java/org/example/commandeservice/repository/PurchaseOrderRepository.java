package org.example.commandeservice.repository;

import org.example.commandeservice.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, UUID> {
    @Override
    @EntityGraph(attributePaths = {"supplier", "items"})
    List<PurchaseOrder> findAll();

    @EntityGraph(attributePaths = {"supplier", "items"})
    Optional<PurchaseOrder> findById(UUID id);
}