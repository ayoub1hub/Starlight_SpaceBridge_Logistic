package org.example.livraisonservice.mapper;

import org.example.livraisonservice.dto.DriverDto;
import org.example.livraisonservice.entity.Driver;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DriverMapper {

    DriverMapper INSTANCE = Mappers.getMapper(DriverMapper.class);

    Driver toEntity(DriverDto dto);
    DriverDto toDto(Driver entity);

    void updateEntityFromDto(DriverDto dto, @MappingTarget Driver entity);
}