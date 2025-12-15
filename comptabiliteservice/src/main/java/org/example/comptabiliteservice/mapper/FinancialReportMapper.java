package org.example.comptabiliteservice.mapper;

import org.example.comptabiliteservice.dto.FinancialReportDto;
import org.example.comptabiliteservice.entity.FinancialReport;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface FinancialReportMapper {

    FinancialReportDto toDto(FinancialReport entity);

    FinancialReport toEntity(FinancialReportDto dto);

    void updateEntityFromDto(FinancialReportDto dto, @MappingTarget FinancialReport entity);
}