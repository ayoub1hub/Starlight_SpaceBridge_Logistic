package org.example.stockservice.mapper;

import org.example.stockservice.dto.*;
import org.example.stockservice.entity.Entrepot;
import org.example.stockservice.entity.Produit;
import org.example.stockservice.entity.Stock;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StockMapper {


    @Mapping(target = "entrepotId", source = "entrepot.id")
    @Mapping(target = "produitId", source = "produit.id")
    @Mapping(target = "entrepot", source = "entrepot", qualifiedByName = "toEntrepotSummary")
    @Mapping(target = "produit", source = "produit", qualifiedByName = "toProduitSummary")
    StockDto toDto(Stock entity);


    @Named("stockToSummary")
    @Mapping(target = "produit", source = "produit", qualifiedByName = "toProduitSummary")
    StockSummaryDto toSummaryDto(Stock entity);

    @Mapping(target = "entrepot", ignore = true)
    @Mapping(target = "produit", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Stock toEntity(StockDto dto);

    // Pour update
    @Mapping(target = "entrepot", ignore = true)
    @Mapping(target = "produit", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateStockFromDto(StockDto dto, @MappingTarget Stock entity);


    @Named("toEntrepotSummary")
    @Mapping(target = "nom", source = "name")
    @Mapping(target = "adresse", source = "address")
    EntrepotSummaryDto toEntrepotSummary(Entrepot entrepot);


    @Named("toProduitSummary")
    @Mapping(target = "nom", source = "name")
    @Mapping(target = "sku", source = "sku")
    @Mapping(target = "unite", constant = "pcs")
    @Mapping(target = "prix", source = "unitPrice")
    ProduitSummaryDto toProduitSummary(Produit produit);
}