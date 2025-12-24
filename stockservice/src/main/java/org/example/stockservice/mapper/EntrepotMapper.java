package org.example.stockservice.mapper;

import org.example.stockservice.dto.EntrepotDto;
import org.example.stockservice.dto.StockSummaryDto;
import org.example.stockservice.entity.Entrepot;
import org.example.stockservice.entity.Stock;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
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

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "stocks", ignore = true)
    @Mapping(target = "responsable", ignore = true)
    @Mapping(target = "admin", ignore = true)
    @Mapping(target = "password", ignore = true)  // Important : on gère le password manuellement
    void updateEntity(EntrepotDto dto, @MappingTarget Entrepot entity);
}