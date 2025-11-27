package org.example.stockservice.mapper;

import org.example.stockservice.dto.ProduitDto;
import org.example.stockservice.entity.Produit;
import org.mapstruct.*;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ProduitMapper {
    ProduitMapper INSTANCE = Mappers.getMapper(ProduitMapper.class);

    ProduitDto toDto(Produit entity);

    @Mapping(target = "stocks", ignore = true) // Avoid circular refs
    Produit toEntity(ProduitDto dto);
}