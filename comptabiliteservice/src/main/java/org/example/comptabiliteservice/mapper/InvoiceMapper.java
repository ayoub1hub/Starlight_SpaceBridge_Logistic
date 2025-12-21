package org.example.comptabiliteservice.mapper;

import org.example.comptabiliteservice.dto.InvoiceRequest;
import org.example.comptabiliteservice.dto.InvoiceResponse;
import org.example.comptabiliteservice.entity.Invoice;
import org.mapstruct.*;

import java.util.UUID;

@Mapper(componentModel = "spring", uses = {InvoiceItemMapper.class, PaymentMapper.class})
public interface InvoiceMapper {

    InvoiceResponse toDto(Invoice entity);


    @Mapping(target = "id", ignore = true)
    Invoice toEntity(InvoiceRequest dto);


    @Mapping(target = "id", source = "id")
    Invoice toEntityForUpdate(UUID id, InvoiceRequest dto);
}
