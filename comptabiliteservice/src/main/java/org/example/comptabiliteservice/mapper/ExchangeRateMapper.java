package org.example.comptabiliteservice.mapper;

import org.example.comptabiliteservice.dto.ExchangeRateDto;
import org.example.comptabiliteservice.entity.ExchangeRate;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExchangeRateMapper {

    ExchangeRateDto toDto(ExchangeRate entity);

    ExchangeRate toEntity(ExchangeRateDto dto);

    void updateEntityFromDto(ExchangeRateDto dto, @MappingTarget ExchangeRate entity);
}