

package org.example.comptabiliteservice.mapper;

import org.example.comptabiliteservice.dto.ExchangeRateDto;
import org.example.comptabiliteservice.entity.ExchangeRate;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ExchangeRateMapper {
    ExchangeRateDto toDto(ExchangeRate entity);
    ExchangeRate toEntity(ExchangeRateDto dto);
}