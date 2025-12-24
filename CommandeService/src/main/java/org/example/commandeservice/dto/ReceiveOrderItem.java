package org.example.commandeservice.dto;


import jakarta.validation.constraints.*;
import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReceiveOrderItem {

    @NotNull(message = "L'ID de l'article de commande est obligatoire")
    private UUID itemId;  // ID du PurchaseOrderItem

    @Positive(message = "La quantité reçue doit être positive")
    private Integer receivedQuantity;
}