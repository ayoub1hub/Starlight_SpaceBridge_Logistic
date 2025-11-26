package org.example.livraisonservice.dto;

import java.time.LocalDateTime;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryProofDto {
    private Long id;
    private String signatureUrl; // URL vers l'image de signature
    private String photoUrl;     // URL vers la photo de livraison
    private String notes;
    private LocalDateTime capturedAt;
}