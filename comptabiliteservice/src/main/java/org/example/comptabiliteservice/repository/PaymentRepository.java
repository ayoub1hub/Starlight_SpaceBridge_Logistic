package org.example.comptabiliteservice.repository;
import org.example.comptabiliteservice.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;


public interface PaymentRepository extends JpaRepository<Payment, UUID> {}