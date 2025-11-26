package org.example.stockservice.dto;

import lombok.*;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonDto {
    private UUID id;
    private String name;
    private String phone;
    private String email;
    private String type;
    private Boolean active;
}