package org.example.authservice.mapper;

import org.example.authservice.dto.RegisterRequest;
import org.example.authservice.dto.UserDto;
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
    UserDto toDto(User entity);

    // RegisterRequest → Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "enabled", constant = "true")
    @Mapping(target = "role", expression = "java(org.example.authservice.entity.Role.USER)")
    @Mapping(target = "password", ignore = true)
    // FIX: Removed the problematic line: @Mapping(target = "authorities", ignore = true)
    User toEntity(RegisterRequest dto);

    // Helper method to convert Role enum to String
    @Named("roleToString")
    default String roleToString(Role role) {
        return role != null ? role.name() : null;
    }
}