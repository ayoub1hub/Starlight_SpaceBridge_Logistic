package org.example.stockservice.mapper;
import org.example.stockservice.dto.PersonDto;
import org.example.stockservice.entity.Person;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface PersonMapper {
    PersonDto toDto(Person entity);
    Person toEntity(PersonDto dto);
}