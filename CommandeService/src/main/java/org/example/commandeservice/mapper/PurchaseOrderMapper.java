package org.example.commandeservice.mapper;

import org.example.commandeservice.dto.PurchaseOrderRequest;
import org.example.commandeservice.dto.PurchaseOrderResponse;
import org.example.commandeservice.entity.PurchaseOrder;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = { SupplierMapper.class, PurchaseOrderItemMapper.class }
)
public interface PurchaseOrderMapper {

    // Entity → Response DTO
    @Mapping(source = "supplier", target = "supplier") // MapStruct uses SupplierMapper automatically
    @Mapping(source = "orderNumber", target = "orderNumber")
    @Mapping(source = "expectedDeliveryDate", target = "expectedDeliveryDate")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "totalAmount", target = "totalAmount")
    @Mapping(source = "customsDeclaration", target = "customsDeclaration")
    PurchaseOrderResponse toDto(PurchaseOrder entity);

    // Request DTO → Entity
    @Mapping(source = "orderNumber", target = "orderNumber")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "actualDeliveryDate", ignore = true)
    @Mapping(target = "warehouseId", ignore = true)
    @Mapping(target = "currency", ignore = true)
    @Mapping(target = "paymentStatus", ignore = true)
    @Mapping(target = "notes", ignore = true)
    @Mapping(target = "customsStatus", ignore = true)
    PurchaseOrder toEntity(PurchaseOrderRequest dto);

    // Update existing entity
    @Mapping(source = "orderNumber", target = "orderNumber")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "supplier", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "actualDeliveryDate", ignore = true)
    @Mapping(target = "warehouseId", ignore = true)
    @Mapping(target = "currency", ignore = true)
    @Mapping(target = "paymentStatus", ignore = true)
    @Mapping(target = "notes", ignore = true)
    @Mapping(target = "customsStatus", ignore = true)
    void updateEntityFromDto(PurchaseOrderRequest dto, @MappingTarget PurchaseOrder entity);
}
