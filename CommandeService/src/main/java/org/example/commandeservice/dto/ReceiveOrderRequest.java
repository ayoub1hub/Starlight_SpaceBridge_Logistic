package org.example.commandeservice.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiveOrderRequest {

    @NotEmpty(message = "La liste des articles reçus ne peut pas être vide")
    private List<ReceiveOrderItem> items;
}

