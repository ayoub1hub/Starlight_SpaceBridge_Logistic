package org.example.commandeservice.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import org.example.stockservice.dto.StockDto;

import java.util.List;
import java.util.UUID;

@FeignClient(name = "stock-service")
public interface StockClient {

    @GetMapping("/api/stocks/warehouses/{entrepotId}")
    List<StockDto> getStockByEntrepot(@PathVariable("entrepotId") UUID entrepotId);
}

