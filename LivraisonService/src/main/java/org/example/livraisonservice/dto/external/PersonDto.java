package org.example.livraisonservice.dto.external;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PersonDto {

    private UUID id;

    private String type; // "admin", "respo", "livreur"

    private String name;

    private String email;

    private String phone;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}