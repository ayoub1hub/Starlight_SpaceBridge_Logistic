package LivraisonService.src.main.java.org.example.livraisonservice.repository;

import LivraisonService.src.main.java.org.example.livraisonservice.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface DriverRepository extends JpaRepository<Driver, UUID> {}