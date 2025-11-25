package org.example.commandeservice.mapper;

import org.example.commandeservice.dto.PurchaseOrderItemDto;
import org.example.commandeservice.entity.PurchaseOrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PurchaseOrderItemMapper {

    @Mapping(source = "quantityOrdered", target = "quantity")
    PurchaseOrderItemDto toDto(PurchaseOrderItem entity);

    @Mapping(target = "purchaseOrder", ignore = true)
    PurchaseOrderItem toEntity(PurchaseOrderItemDto dto);
}