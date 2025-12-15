package org.example.stockservice.mapper;

import org.example.stockservice.dto.EntrepotDto;
import org.example.stockservice.entity.Entrepot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = PersonMapper.class
)
public interface EntrepotMapper {

    @Mapping(source = "isActive", target = "active")
    EntrepotDto toDto(Entrepot entity);

    @Mapping(source = "active", target = "isActive")
    @Mapping(target = "stocks", ignore = true)     // Avoid circular refs
    @Mapping(target = "updatedAt", ignore = true)  // Managed by service/entity
    Entrepot toEntity(EntrepotDto dto);
}
