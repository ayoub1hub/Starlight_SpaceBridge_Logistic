package org.example.stockservice.mapper;

import org.example.stockservice.dto.StockDto;
import org.example.stockservice.entity.Stock;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = {EntrepotMapper.class, ProduitMapper.class}
)
public interface StockMapper {

    @Mapping(target = "entrepotId", expression = "java(entity.getEntrepot() != null ? entity.getEntrepot().getId() : null)")
    @Mapping(target = "produitId", expression = "java(entity.getProduit() != null ? entity.getProduit().getId() : null)")
    @Mapping(target = "entrepotName", source = "entrepot.name")
    @Mapping(target = "produitName", source = "produit.name")
    @Mapping(target = "sku", source = "produit.sku")
    StockDto toDto(Stock entity);

    @Mapping(target = "entrepot", ignore = true)   // Set manually in service
    @Mapping(target = "produit", ignore = true)    // Set manually in service
    @Mapping(target = "updatedAt", ignore = true)  // Managed by service/entity
    Stock toEntity(StockDto dto);
}