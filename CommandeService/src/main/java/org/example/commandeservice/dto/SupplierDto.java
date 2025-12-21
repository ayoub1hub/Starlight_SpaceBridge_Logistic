// SupplierDto.java
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
    private String contactEmail;   // maps to companyContact
    private String email;
    private String address;
    private String currency;
    private String paymentTerms;
    private String taxId;
    private Double rating;
    private Boolean isInternational;
    private Boolean isActive;
}