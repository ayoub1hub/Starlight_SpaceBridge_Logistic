package org.example.comptabiliteservice.client;

import org.example.comptabiliteservice.dto.external.SaleResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "vente-service-from-compta", url = "${venteservice.url}")
public interface VenteClient {
    @GetMapping("/api/sales/{id}")
    SaleResponse getSaleById(@PathVariable("id") UUID id);
}