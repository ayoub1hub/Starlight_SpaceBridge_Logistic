package org.example.livraisonservice.client;

import org.example.livraisonservice.dto.external.PurchaseOrderResponseDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "commande-service", url = "${commande-service.url:http://localhost:8082}")
public interface CommandeClient {

    @GetMapping("/api/purchase-orders")
    List<PurchaseOrderResponseDto> getAllCommandes();

    @GetMapping("/api/purchase-orders/{id}")
    PurchaseOrderResponseDto getCommandeById(@PathVariable("id") UUID id);

    @GetMapping("/api/purchase-orders")
    List<PurchaseOrderResponseDto> getCommandesByStatus(@RequestParam("status") String status);
}