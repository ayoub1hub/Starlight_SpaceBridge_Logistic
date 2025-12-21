package org.example.venteservice.mapper;

import org.example.venteservice.dto.SalesOrderRequest;
import org.example.venteservice.dto.SalesOrderResponse;
import org.example.venteservice.entity.SalesOrder;
import org.mapstruct.*;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface SalesOrderMapper {

    SalesOrderResponse toDto(SalesOrder entity);

    SalesOrder toEntity(SalesOrderRequest request);

    void updateEntityFromDto(SalesOrderRequest request, @MappingTarget SalesOrder entity);
}