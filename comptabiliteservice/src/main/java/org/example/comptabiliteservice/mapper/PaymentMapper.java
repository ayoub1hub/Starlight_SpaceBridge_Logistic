package org.example.comptabiliteservice.mapper;

import org.example.comptabiliteservice.dto.PaymentDto;
import org.example.comptabiliteservice.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PaymentMapper {

    PaymentDto toDto(Payment entity);

    Payment toEntity(PaymentDto dto);

    void updateEntityFromDto(PaymentDto dto, @MappingTarget Payment entity);
}