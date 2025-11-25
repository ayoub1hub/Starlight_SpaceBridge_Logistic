package org.example.commandeservice.mapper;


import org.example.commandeservice.entity.PurchaseOrder;
import org.example.commandeservice.dto.PurchaseOrderRequest;
import org.example.commandeservice.dto.PurchaseOrderResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.UUID;


@Mapper(componentModel = "spring", uses = {SupplierMapper.class, PurchaseOrderItemMapper.class}) // <-- ADDED 'uses'
public interface PurchaseOrderMapper {
    // Converts Entity to Response DTO for sending data out
    PurchaseOrderResponse toDto(PurchaseOrder entity);

    // Converts Request DTO to Entity for saving data in
    @Mapping(target = "id", ignore = true) // Database generates ID

    PurchaseOrder toEntity(PurchaseOrderRequest dto);

    // Allows mapping existing entities for updates
    @Mapping(target = "id", source = "id")
    PurchaseOrder toEntityForUpdate(UUID id, PurchaseOrderRequest dto);
}