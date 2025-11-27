package org.example.commandeservice.repository;

import org.example.commandeservice.entity.CustomsDeclaration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface CustomsDeclarationRepository extends JpaRepository<CustomsDeclaration, UUID> {}