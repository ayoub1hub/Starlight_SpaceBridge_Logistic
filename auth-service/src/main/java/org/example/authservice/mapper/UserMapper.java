// src/main/java/org/example/authservice/mapper/UserMapper.java
package org.example.authservice.mapper;

import org.example.authservice.dto.UserDto;
import org.example.authservice.entity.Entrepot;
import org.example.authservice.entity.Role;
import org.example.authservice.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface UserMapper {

    // Entity → DTO
    @Mapping(source = "role", target = "role", qualifiedByName = "roleToString")
    @Mapping(source = "entrepot", target = "entrepotCode", qualifiedByName = "entrepotToCode")
    @Mapping(source = "entrepot", target = "entrepotName", qualifiedByName = "entrepotToName")
    UserDto toDto(User entity);

    // Helper: Role enum → String
    @Named("roleToString")
    default String roleToString(Role role) {
        return role != null ? role.name() : null;
    }

    // Helper: Entrepot → Code
    @Named("entrepotToCode")
    default String entrepotToCode(Entrepot entrepot) {
        return entrepot != null ? entrepot.getCode() : null;
    }

    // Helper: Entrepot → Name
    @Named("entrepotToName")
    default String entrepotToName(Entrepot entrepot) {
        return entrepot != null ? entrepot.getName() : null;
    }
}