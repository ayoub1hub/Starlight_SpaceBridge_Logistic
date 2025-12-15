package org.example.livraisonservice.mapper;

import org.example.livraisonservice.dto.DeliveryItemDto;
import org.example.livraisonservice.entity.DeliveryItem;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DeliveryItemMapper {

    DeliveryItemMapper INSTANCE = Mappers.getMapper(DeliveryItemMapper.class);

    DeliveryItem toEntity(DeliveryItemDto dto);
    DeliveryItemDto toDto(DeliveryItem entity);

    void updateEntityFromDto(DeliveryItemDto dto, @MappingTarget DeliveryItem entity);
}