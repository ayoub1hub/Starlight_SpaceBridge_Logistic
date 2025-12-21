package org.example.livraisonservice.mapper;

import org.example.livraisonservice.dto.DeliveryItemDto;
import org.example.livraisonservice.entity.DeliveryItem;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DeliveryItemMapper {

    DeliveryItem toEntity(DeliveryItemDto dto);
    DeliveryItemDto toDto(DeliveryItem entity);

}