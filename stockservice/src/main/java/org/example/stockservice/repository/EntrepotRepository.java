package stockservice.src.main.java.org.example.stockservice.repository;

import org.springframework.stereotype.Repository;
import stockservice.src.main.java.org.example.stockservice.entity.Entrepot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

@Repository
public interface EntrepotRepository extends JpaRepository<Entrepot, UUID> {}