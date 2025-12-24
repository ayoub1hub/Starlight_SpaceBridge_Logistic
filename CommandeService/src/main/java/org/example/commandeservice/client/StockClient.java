package org.example.commandeservice.client;

import org.example.commandeservice.dto.external.StockUpdateRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "stock-service-from-commande", url = "${stockservice.url}")
public interface StockClient {

    @PostMapping("/api/stocks/receive")
    void updateStockOnReceive(@RequestBody StockUpdateRequest request);
}