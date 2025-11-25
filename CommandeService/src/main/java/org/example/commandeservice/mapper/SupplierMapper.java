package org.example.commandeservice.mapper;

import org.example.commandeservice.dto.SupplierDto;
import org.example.commandeservice.entity.Supplier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SupplierMapper {

    // Map Entity companyName to DTO name field
    @Mapping(source = "companyName", target = "name")
    SupplierDto toDto(Supplier entity);


}