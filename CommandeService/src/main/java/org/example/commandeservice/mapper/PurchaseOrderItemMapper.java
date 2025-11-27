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
    @Mapping(source = "quantityOrdered", target = "quantity")
    @Mapping(target = "purchaseOrderId", expression = "java(entity.getPurchaseOrder() != null ? entity.getPurchaseOrder().getId() : null)")
    PurchaseOrderItemDto toDto(PurchaseOrderItem entity);

    // DTO → Entity
    @Mapping(target = "purchaseOrder", ignore = true)
    @Mapping(target = "quantityOrdered", source = "quantity")
    @Mapping(target = "quantityReceived", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "productId", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    @Mapping(target = "taxAmount", ignore = true)
    @Mapping(target = "discount", ignore = true)
    PurchaseOrderItem toEntity(PurchaseOrderItemDto dto);
}
