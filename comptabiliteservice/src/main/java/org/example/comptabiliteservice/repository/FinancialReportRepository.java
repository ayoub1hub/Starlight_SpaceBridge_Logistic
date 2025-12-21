package org.example.comptabiliteservice.repository;

import org.example.comptabiliteservice.entity.FinancialReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface FinancialReportRepository extends JpaRepository<FinancialReport, UUID> {}