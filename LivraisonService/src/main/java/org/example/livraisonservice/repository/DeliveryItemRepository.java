package LivraisonService.src.main.java.org.example.livraisonservice.repository;

import LivraisonService.src.main.java.org.example.livraisonservice.entity.DeliveryItem;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

@Repository
public interface DeliveryItemRepository extends JpaRepository<DeliveryItem, UUID> {}