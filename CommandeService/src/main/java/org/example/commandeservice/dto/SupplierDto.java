package org.example.commandeservice.dto;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SupplierDto {
    private UUID id;
    private String companyName;
    private String contactEmail;
}