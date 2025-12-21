package org.example.commandeservice.mapper;

import org.example.commandeservice.dto.PurchaseOrderItemDto;
import org.example.commandeservice.entity.PurchaseOrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface PurchaseOrderItemMapper {

    // Entity → DTO
    @Mapping(source = "purchaseOrder.id", target = "purchaseOrderId")
    PurchaseOrderItemDto toDto(PurchaseOrderItem entity);

    // DTO → Entity
    PurchaseOrderItem toEntity(PurchaseOrderItemDto dto);
}
