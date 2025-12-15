package org.example.stockservice.mapper;

import org.example.stockservice.dto.PersonDto;
import org.example.stockservice.entity.Person;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface PersonMapper {

    @Mapping(source = "isActive", target = "active")
    PersonDto toDto(Person entity);

    @Mapping(source = "active", target = "isActive")
    @Mapping(target = "createdAt", ignore = true)  // Set automatically by entity
    @Mapping(target = "updatedAt", ignore = true)  // Managed by service/entity
    Person toEntity(PersonDto dto);
}