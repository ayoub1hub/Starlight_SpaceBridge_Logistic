
package org.example.comptabiliteservice.mapper;

import org.example.comptabiliteservice.dto.InvoiceRequest;
import org.example.comptabiliteservice.dto.InvoiceResponse;
import org.example.comptabiliteservice.entity.Invoice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.UUID;

@Mapper(componentModel = "spring", uses = {InvoiceItemMapper.class, PaymentMapper.class}) // <--- هادو مهمين
public interface InvoiceMapper {

    InvoiceResponse toDto(Invoice entity);


    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Invoice toEntity(InvoiceRequest dto);


    @Mapping(target = "id", source = "id")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Invoice toEntityForUpdate(UUID id, InvoiceRequest dto);
}