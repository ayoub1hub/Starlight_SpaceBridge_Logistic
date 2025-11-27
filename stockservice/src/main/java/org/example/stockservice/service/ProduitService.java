package org.example.stockservice.service;

import org.example.stockservice.dto.ProduitDto;
import org.example.stockservice.entity.Produit;
import org.example.stockservice.mapper.ProduitMapper;
import org.example.stockservice.repository.ProduitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final ProduitMapper produitMapper; // Injected mapper

    public ProduitService(ProduitRepository produitRepository, ProduitMapper produitMapper) {
        this.produitRepository = produitRepository;
        this.produitMapper = produitMapper;
    }

    public List<ProduitDto> getAllProduits() {
        return produitRepository.findAll().stream()
                .map(produitMapper::toDto)
                .collect(Collectors.toList());
    }

    public ProduitDto getProduitById(UUID id) {
        Produit produit = produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé"));
        return produitMapper.toDto(produit);
    }

    public ProduitDto createProduit(ProduitDto dto) {
        if (produitRepository.findBySku(dto.getSku()).isPresent()) {
            throw new IllegalArgumentException("SKU déjà utilisé : " + dto.getSku());
        }

        Produit produit = produitMapper.toEntity(dto);
        Produit saved = produitRepository.save(produit);
        return produitMapper.toDto(saved);
    }
}