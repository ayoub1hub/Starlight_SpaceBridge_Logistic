package org.example.stockservice.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
@ToString
public class WarehouseLoginRequest {
    @NotBlank(message = "Le code ou nom de l'entrepôt est obligatoire")
    String code;
    @NotBlank(message = "Le mot de passe est obligatoire")
    String password;
}