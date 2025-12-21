package org.example.comptabiliteservice.client;

import org.example.commandeservice.dto.PurchaseOrderResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.*;

@FeignClient(name = "COMMANDE-SERVICE")  // ← majuscules comme dans Eureka
public interface CommandeClient {

    @GetMapping("/api/purchase-orders/{id}")
    PurchaseOrderResponse getCommandeById(@PathVariable("id") UUID id);

    // Pour facturer toutes les commandes validées
    @GetMapping("/api/purchase-orders?status=VALIDATED")
    List<PurchaseOrderResponse> getCommandesAfacturer();
}
