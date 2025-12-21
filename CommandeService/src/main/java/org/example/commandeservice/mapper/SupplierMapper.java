package org.example.commandeservice.mapper;

import org.example.commandeservice.dto.SupplierDto;
import org.example.commandeservice.entity.Supplier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

// SupplierMapper.java
@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface SupplierMapper {

    // Entity → DTO
    @Mapping(source = "companyContact", target = "contactEmail")
    SupplierDto toDto(Supplier entity);

    // DTO → Entity
    @Mapping(source = "contactEmail", target = "companyContact")
    Supplier toEntity(SupplierDto dto);
}
