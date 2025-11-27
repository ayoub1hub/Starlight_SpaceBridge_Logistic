

package org.example.comptabiliteservice.mapper;

import org.example.comptabiliteservice.dto.InvoiceItemDto;
import org.example.comptabiliteservice.entity.InvoiceItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface InvoiceItemMapper {
    InvoiceItemDto toDto(InvoiceItem entity);

    @Mapping(target = "invoice", ignore = true)
    InvoiceItem toEntity(InvoiceItemDto dto);
}
