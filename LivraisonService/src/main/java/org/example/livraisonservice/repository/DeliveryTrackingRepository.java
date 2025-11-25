package LivraisonService.src.main.java.org.example.livraisonservice.repository;

import LivraisonService.src.main.java.org.example.livraisonservice.entity.DeliveryTracking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DeliveryTrackingRepository extends JpaRepository<DeliveryTracking, UUID> {}