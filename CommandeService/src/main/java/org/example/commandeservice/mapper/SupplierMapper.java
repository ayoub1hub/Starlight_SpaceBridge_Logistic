package org.example.commandeservice.mapper;

import org.example.commandeservice.dto.SupplierDto;
import org.example.commandeservice.entity.Supplier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface SupplierMapper {

    // Entity → DTO
    @Mapping(source = "companyContact", target = "contactEmail")
    SupplierDto toDto(Supplier entity);

    // DTO → Entity
    @Mapping(target = "companyContact", ignore = true)
    @Mapping(target = "email", ignore = true)
    @Mapping(target = "address", ignore = true)
    @Mapping(target = "currency", ignore = true)
    @Mapping(target = "paymentTerms", ignore = true)
    @Mapping(target = "taxId", ignore = true)
    @Mapping(target = "rating", ignore = true)
    @Mapping(target = "isInternational", ignore = true)
    @Mapping(target = "isActive", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "purchaseOrders", ignore = true)
    Supplier toEntity(SupplierDto dto);
}
