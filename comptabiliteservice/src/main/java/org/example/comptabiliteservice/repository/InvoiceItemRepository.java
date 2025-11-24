package org.example.comptabiliteservice.repository;
import org.example.comptabiliteservice.entity.InvoiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface InvoiceItemRepository extends JpaRepository<InvoiceItem, UUID> {}