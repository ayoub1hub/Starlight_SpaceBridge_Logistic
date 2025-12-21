package org.example.comptabiliteservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.comptabiliteservice.client.CommandeClient;
import org.example.commandeservice.dto.PurchaseOrderResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestController {

    private final CommandeClient commandeClient;

    @GetMapping("/commande/{id}")
    public ResponseEntity<PurchaseOrderResponse> testGetCommande(@PathVariable UUID id) {
        return ResponseEntity.ok(commandeClient.getCommandeById(id));
    }

    @GetMapping("/commandes-a-facturer")
    public ResponseEntity<List<PurchaseOrderResponse>> testCommandesAFacturer() {
        return ResponseEntity.ok(commandeClient.getCommandesAfacturer());
    }
}