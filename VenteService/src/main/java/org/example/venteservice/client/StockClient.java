package org.example.venteservice.client;

import org.example.venteservice.dto.external.ReserveStockRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "stock-client-from-vente", url = "${stockservice.url}")
public interface StockClient {
    @PostMapping("/api/stocks/reserve")
    void reserveStock(@RequestBody ReserveStockRequest request);
}