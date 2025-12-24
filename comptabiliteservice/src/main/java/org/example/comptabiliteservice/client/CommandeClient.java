package org.example.comptabiliteservice.client;

import org.example.comptabiliteservice.dto.external.PurchaseResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.*;

@FeignClient(name = "commande-service-from-compta" ,url = "${commandeservice.url}")
public interface CommandeClient {
    @GetMapping("/api/purchases/{id}")
    PurchaseResponse getPurchaseById(@PathVariable("id") UUID id);
}