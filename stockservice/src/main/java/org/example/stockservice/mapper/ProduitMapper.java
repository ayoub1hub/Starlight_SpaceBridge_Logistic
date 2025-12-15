package org.example.stockservice.mapper;

import org.example.stockservice.dto.ProduitDto;
import org.example.stockservice.entity.Produit;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ProduitMapper {

    @Mapping(source = "isHazardous", target = "hazardous")
    ProduitDto toDto(Produit entity);

    @Mapping(source = "hazardous", target = "isHazardous")
    @Mapping(target = "stocks", ignore = true)     // Avoid circular refs
    @Mapping(target = "updatedAt", ignore = true)  // Managed by service/entity
    Produit toEntity(ProduitDto dto);
}