

package org.example.comptabiliteservice.mapper;

import org.example.comptabiliteservice.dto.ExchangeRateDto;
import org.example.comptabiliteservice.entity.ExchangeRate;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExchangeRateMapper {
    ExchangeRateDto toDto(ExchangeRate entity);

    @Mapping(target = "createdAt", ignore = true)
    ExchangeRate toEntity(ExchangeRateDto dto);
}