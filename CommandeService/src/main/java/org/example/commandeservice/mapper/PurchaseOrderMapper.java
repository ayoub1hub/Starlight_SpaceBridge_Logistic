package org.example.commandeservice.mapper;

import org.example.commandeservice.dto.PurchaseOrderRequest;
import org.example.commandeservice.dto.PurchaseOrderResponse;
import org.example.commandeservice.entity.PurchaseOrder;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = { SupplierMapper.class, PurchaseOrderItemMapper.class }
)
public interface PurchaseOrderMapper {

    // Entity → DTO : parfait, on garde
    PurchaseOrderResponse toDto(PurchaseOrder entity);

    // DTO → Entity
    PurchaseOrder toEntity(PurchaseOrderRequest dto);

    // Update : même chose
    void updateEntityFromDto(PurchaseOrderRequest dto, @MappingTarget PurchaseOrder entity);
}
