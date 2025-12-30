package org.example.livraisonservice.mapper;

import org.example.livraisonservice.dto.IncidentRequestDto;
import org.example.livraisonservice.dto.IncidentResponseDto;
import org.example.livraisonservice.entity.Incident;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface IncidentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "incidentCode", ignore = true)
    @Mapping(target = "reportedBy", ignore = true)
    @Mapping(target = "reportedAt", ignore = true)
    @Mapping(target = "warehouseId", ignore = true)
    @Mapping(target = "resolved", constant = "false")
    @Mapping(target = "resolvedAt", ignore = true)
    Incident toEntity(IncidentRequestDto dto);

    IncidentResponseDto toResponseDto(Incident entity);

    List<IncidentResponseDto> toResponseDtoList(List<Incident> entities);
}