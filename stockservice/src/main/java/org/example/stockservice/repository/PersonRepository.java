package org.example.stockservice.repository;

import org.springframework.stereotype.Repository;
import org.example.stockservice.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

@Repository
public interface PersonRepository extends JpaRepository<Person, UUID> {
}