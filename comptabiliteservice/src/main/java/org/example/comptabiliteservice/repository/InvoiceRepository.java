package org.example.comptabiliteservice.repository;

import org.example.comptabiliteservice.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    Optional<Invoice> findByReferenceTypeAndReferenceId(String referenceType, UUID referenceId);
}