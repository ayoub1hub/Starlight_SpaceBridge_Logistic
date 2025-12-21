package org.example.commandeservice.controller;

import lombok.RequiredArgsConstructor;
import org.example.commandeservice.client.StockClient;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/test")
public class TestStockController {

    private final StockClient stockClient;

    @GetMapping("/check-stock")
    public String checkStock() {
        try {
            var stock = stockClient.getStockByEntrepot(
                    UUID.fromString("11111111-1111-1111-1111-111111111111")
            );
            return "COMMANDE → STOCK OK ! " + stock.size() + " lignes de stock trouvées";
        } catch (Exception e) {
            return "ERREUR : " + e.getMessage();
        }
    }
}