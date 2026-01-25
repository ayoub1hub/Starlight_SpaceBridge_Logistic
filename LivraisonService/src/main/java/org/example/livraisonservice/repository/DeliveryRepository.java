package org.example.livraisonservice.repository;

import org.example.livraisonservice.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {
    List<Delivery> findByDriverName(String driverUsername);
    List<Delivery> findByDriverId(UUID driverId);
}