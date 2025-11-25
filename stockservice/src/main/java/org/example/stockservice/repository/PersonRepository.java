package stockservice.src.main.java.org.example.stockservice.repository;

import stockservice.src.main.java.org.example.stockservice.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PersonRepository extends JpaRepository<Person, UUID> {
}