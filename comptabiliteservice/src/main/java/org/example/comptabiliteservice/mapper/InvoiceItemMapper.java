package org.example.comptabiliteservice.mapper;

import org.example.comptabiliteservice.dto.InvoiceItemDto;
import org.example.comptabiliteservice.entity.InvoiceItem;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface InvoiceItemMapper {

    InvoiceItemDto toDto(InvoiceItem entity);

    InvoiceItem toEntity(InvoiceItemDto dto);

    void updateEntityFromDto(InvoiceItemDto dto, @MappingTarget InvoiceItem entity);
}