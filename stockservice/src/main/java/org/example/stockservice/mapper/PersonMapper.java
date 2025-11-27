package org.example.stockservice.mapper;

import org.example.stockservice.dto.PersonDto;
import org.example.stockservice.entity.Person;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface PersonMapper {
    PersonMapper INSTANCE = Mappers.getMapper(PersonMapper.class);

    PersonDto toDto(Person entity);
    Person toEntity(PersonDto dto);
}