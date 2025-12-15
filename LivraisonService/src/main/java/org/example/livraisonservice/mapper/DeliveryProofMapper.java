package org.example.livraisonservice.mapper;

import org.example.livraisonservice.dto.DeliveryProofDto;
import org.example.livraisonservice.entity.DeliveryProof;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DeliveryProofMapper {

    DeliveryProofMapper INSTANCE = Mappers.getMapper(DeliveryProofMapper.class);

    DeliveryProof toEntity(DeliveryProofDto dto);
    DeliveryProofDto toDto(DeliveryProof entity);

    void updateEntityFromDto(DeliveryProofDto dto, @MappingTarget DeliveryProof entity);
}