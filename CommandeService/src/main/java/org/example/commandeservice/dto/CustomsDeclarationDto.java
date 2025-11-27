package org.example.commandeservice.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CustomsDeclarationDto {
    private UUID id; // Fixed type
    private String declarationNumber;
    private LocalDate declarationDate;
    private String status;


    private LocalDate clearanceDate;
    private Double totalCharges;
}