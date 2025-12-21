package org.example.livraisonservice.mapper;

import org.example.livraisonservice.dto.DeliveryTrackingDto;
import org.example.livraisonservice.entity.DeliveryTracking;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DeliveryTrackingMapper {

    DeliveryTracking toEntity(DeliveryTrackingDto dto);

    DeliveryTrackingDto toDto(DeliveryTracking entity);
}