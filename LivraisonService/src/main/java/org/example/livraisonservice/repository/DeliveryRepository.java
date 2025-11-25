package LivraisonService.src.main.java.org.example.livraisonservice.repository;

import LivraisonService.src.main.java.org.example.livraisonservice.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DeliveryRepository extends JpaRepository<Delivery, UUID> {}