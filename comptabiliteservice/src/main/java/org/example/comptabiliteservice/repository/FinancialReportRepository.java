package org.example.comptabiliteservice.repository;
import com.example.sslproject.comptabiliteservice.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface FinancialReportRepository extends JpaRepository<FinancialReport, UUID> {}