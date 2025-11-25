package LivraisonService.src.main.java.org.example.livraisonservice.repository;

import LivraisonService.src.main.java.org.example.livraisonservice.entity.DeliveryTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import org.springframework.stereotype.Repository;


@Repository
public interface DeliveryTrackingRepository extends JpaRepository<DeliveryTracking, UUID> {
    // retourne tous les tracking d'une livraison (la propriété dans DeliveryTracking s'appelle "delivery")
    List<DeliveryTracking> findByDeliveryId(UUID deliveryId);
}