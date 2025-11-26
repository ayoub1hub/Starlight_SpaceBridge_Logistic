package org.example.stockservice.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EntrepotDto {
    private UUID id;
    private String name;
    private String address;
    private Double capacity;
    private PersonDto responsable; // objet imbriqué
    private Boolean active;
    private LocalDateTime createdAt;
}