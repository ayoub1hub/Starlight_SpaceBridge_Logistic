package org.example.stockservice.mapper;

import org.example.stockservice.dto.EntrepotDto;
import org.example.stockservice.entity.Entrepot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.ERROR,
        uses = PersonMapper.class // Handles nested Person mapping
)
public interface EntrepotMapper {
    EntrepotMapper INSTANCE = Mappers.getMapper(EntrepotMapper.class);

    EntrepotDto toDto(Entrepot entity);

    @Mapping(target = "stocks", ignore = true) // Avoid circular refs
    Entrepot toEntity(EntrepotDto dto);
}