package org.example.livraisonservice.mapper;

import org.example.livraisonservice.dto.DriverDto;
import org.example.livraisonservice.entity.Driver;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DriverMapper {

    // Mapping basique entity → DTO (sans name et phone)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "phone", ignore = true)
    DriverDto toDto(Driver entity);

    // création --> ignore name et phone
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "phone", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Driver toEntity(DriverDto dto);
}