package org.example.livraisonservice.mapper;

import org.example.livraisonservice.dto.DeliveryDto;
import org.example.livraisonservice.entity.Delivery;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DeliveryMapper {

    Delivery toEntity(DeliveryDto dto);

    DeliveryDto toDto(Delivery entity);
}