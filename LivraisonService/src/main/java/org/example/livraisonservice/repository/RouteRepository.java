package LivraisonService.src.main.java.org.example.livraisonservice.repository;

import LivraisonService.src.main.java.org.example.livraisonservice.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface RouteRepository extends JpaRepository<Route, UUID> {}