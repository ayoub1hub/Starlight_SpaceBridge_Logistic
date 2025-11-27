

package org.example.comptabiliteservice.mapper;

import org.example.comptabiliteservice.dto.PaymentDto;
import org.example.comptabiliteservice.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    PaymentDto toDto(Payment entity);

    @Mapping(target = "invoice", ignore = true)
    Payment toEntity(PaymentDto dto);
}