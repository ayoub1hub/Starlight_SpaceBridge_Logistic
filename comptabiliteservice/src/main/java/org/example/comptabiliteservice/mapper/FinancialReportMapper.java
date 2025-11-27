

package org.example.comptabiliteservice.mapper;

import org.example.comptabiliteservice.dto.FinancialReportDto;
import org.example.comptabiliteservice.entity.FinancialReport;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FinancialReportMapper {
    FinancialReportDto toDto(FinancialReport entity);


    FinancialReport toEntity(FinancialReportDto dto);
}