// org.example.comptabiliteservice.dto.PaymentDto.java

package org.example.comptabiliteservice.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PaymentDto {
    private UUID id;
    private LocalDateTime paymentDate;
    private Double amountPaid;
    private String currency;
    private String paymentMethod;
    private String transactionReference;

}
