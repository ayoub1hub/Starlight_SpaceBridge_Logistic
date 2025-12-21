package org.example.stockservice.mapper;
import org.example.stockservice.dto.ProduitDto;
import org.example.stockservice.entity.Produit;
import org.mapstruct.*;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface ProduitMapper {
    ProduitDto toDto(Produit entity);
    Produit toEntity(ProduitDto dto);
}