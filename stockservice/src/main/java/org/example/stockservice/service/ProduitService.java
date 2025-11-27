package org.example.stockservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.example.stockservice.dto.ProduitDto;
import org.example.stockservice.entity.Produit;
import org.example.stockservice.repository.ProduitRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProduitService {

    @Autowired
    private ProduitRepository produitRepository;

    public List<ProduitDto> getAllProduits() {
        return produitRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public ProduitDto getProduitById(UUID id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
        return mapToDto(produit);
    }

    public ProduitDto createProduit(ProduitDto dto) {
        if (produitRepository.findBySku(dto.getSku()).isPresent()) {
            throw new IllegalArgumentException("SKU déjà utilisé : " + dto.getSku());
        }

        Produit produit = new Produit();
        produit.setSku(dto.getSku());
        produit.setName(dto.getName());
        produit.setDescription(dto.getDescription());
        produit.setCategory(dto.getCategory());
        produit.setUnitPrice(dto.getUnitPrice());
        produit.setWeight(dto.getWeight());
        produit.setDimensions(dto.getDimensions());
        produit.setIsHazardous(dto.getHazardous());
        produit.setRequiresSpecialHandling(dto.getRequiresSpecialHandling());

        Produit saved = produitRepository.save(produit);
        return mapToDto(saved);
    }

    private ProduitDto mapToDto(Produit entity) {
        ProduitDto dto = new ProduitDto();
        dto.setId(entity.getId());
        dto.setSku(entity.getSku());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setCategory(entity.getCategory());
        dto.setUnitPrice(entity.getUnitPrice());
        dto.setWeight(entity.getWeight());
        dto.setDimensions(entity.getDimensions());
        dto.setHazardous(entity.getIsHazardous());
        dto.setRequiresSpecialHandling(entity.getRequiresSpecialHandling());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}