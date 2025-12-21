package org.example.stockservice.mapper;
import org.example.stockservice.dto.*;
import org.example.stockservice.entity.Entrepot;
import org.example.stockservice.entity.Produit;
import org.example.stockservice.entity.Stock;
import org.mapstruct.*;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface StockMapper {
    // Stock détaillé → DTO complet
    @Mapping(target = "entrepotId", source = "entrepot.id")
    @Mapping(target = "produitId", source = "produit.id")
    @Mapping(target = "entrepot", source = "entrepot", qualifiedByName = "toEntrepotSummary")
    @Mapping(target = "produit", source = "produit", qualifiedByName = "toProduitSummary")
    StockDto toDto(Stock entity);
    // Stock → version summary (utilisé dans liste d'entrepôt)
    @Named("stockToSummary")
    @Mapping(target = "produit", source = "produit", qualifiedByName = "toProduitSummary")
    StockSummaryDto toSummaryDto(Stock entity);
    // DTO → Entity (pour création)
    @Mapping(target = "entrepot", ignore = true)
    @Mapping(target = "produit", ignore = true)
    Stock toEntity(StockDto dto);
    // Pour update
    @Mapping(target = "entrepot", ignore = true)
    @Mapping(target = "produit", ignore = true)
    void updateStockFromDto(StockDto dto, @MappingTarget Stock entity);
    @Named("toEntrepotSummary")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "location", source = "location")
    @Mapping(target = "address", source = "address")
    EntrepotSummaryDto toEntrepotSummary(Entrepot entrepot);
    @Named("toProduitSummary")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "sku", source = "sku")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "unitPrice", source = "unitPrice")
    ProduitSummaryDto toProduitSummary(Produit produit);
}