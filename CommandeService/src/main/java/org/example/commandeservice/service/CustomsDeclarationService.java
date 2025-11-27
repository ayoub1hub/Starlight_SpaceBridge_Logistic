package org.example.commandeservice.service;


import org.example.commandeservice.entity.CustomsDeclaration;
import org.example.commandeservice.repository.CustomsDeclarationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CustomsDeclarationService {
    private final CustomsDeclarationRepository repository;

    public CustomsDeclarationService(CustomsDeclarationRepository repository) {
        this.repository = repository;
    }

    public List<CustomsDeclaration> getAll() {
        return repository.findAll();
    }

    public Optional<CustomsDeclaration> getById(UUID id) {
        return repository.findById(id);
    }

    public CustomsDeclaration save(CustomsDeclaration declaration) {
        return repository.save(declaration);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }

    public CustomsDeclaration update(UUID id, CustomsDeclaration declaration) {
        declaration.setId(id);
        return repository.save(declaration);
    }

    public boolean exists(UUID id) {
        return repository.existsById(id);
    }
}