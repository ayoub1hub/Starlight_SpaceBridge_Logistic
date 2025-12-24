package org.example.commandeservice.repository;

import feign.Param;
import org.example.commandeservice.entity.PurchaseOrder;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, UUID> {
    @Override
    @EntityGraph(attributePaths = {"supplier", "items"})
    List<PurchaseOrder> findAll();

    @Query("SELECT po FROM PurchaseOrder po LEFT JOIN FETCH po.items WHERE po.id = :id")
    Optional<PurchaseOrder> findByIdWithItems(@Param("id") UUID id);

    @EntityGraph(attributePaths = {"supplier", "items"})
    Optional<PurchaseOrder> findById(UUID id);
}