package org.example.stockservice.mapper;

import org.example.stockservice.dto.EntrepotDto;
import org.example.stockservice.dto.StockSummaryDto;
import org.example.stockservice.entity.Entrepot;
import org.example.stockservice.entity.Stock;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = { StockMapper.class, PersonMapper.class }
)
public interface EntrepotMapper {

    @Mapping(target = "stocks", source = "stocks", qualifiedByName = "stockToSummary")
    EntrepotDto toDto(Entrepot entity);

    // On délègue directement à StockMapper
    @Mapping(target = "stocks", ignore = true)
    Entrepot toEntity(EntrepotDto dto);
}