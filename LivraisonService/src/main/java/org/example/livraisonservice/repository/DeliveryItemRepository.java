package LivraisonService.src.main.java.org.example.livraisonservice.repository;

import LivraisonService.src.main.java.org.example.livraisonservice.entity.DeliveryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DeliveryItemRepository extends JpaRepository<DeliveryItem, UUID> {}