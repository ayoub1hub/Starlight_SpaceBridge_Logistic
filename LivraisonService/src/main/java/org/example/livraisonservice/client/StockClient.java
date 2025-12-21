package org.example.livraisonservice.client;

import org.example.livraisonservice.dto.external.StockDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "stock-client-from-livraison", url = "${stockservice.url}")
public interface StockClient {
    @GetMapping("/api/stocks/warehouses/{entrepotId}")
    List<StockDto> getStockByEntrepot(@PathVariable("entrepotId") UUID entrepotId);
}