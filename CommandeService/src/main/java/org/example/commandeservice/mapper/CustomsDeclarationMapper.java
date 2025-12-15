package org.example.commandeservice.mapper;

import org.example.commandeservice.dto.CustomsDeclarationDto;
import org.example.commandeservice.entity.CustomsDeclaration; // Assuming entity name
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomsDeclarationMapper {

    CustomsDeclaration toEntity(CustomsDeclarationDto dto);
    CustomsDeclarationDto toDto(CustomsDeclaration entity);

    // Optional: For updating an existing entity
    void updateEntityFromDto(CustomsDeclarationDto dto, @MappingTarget CustomsDeclaration entity);
}