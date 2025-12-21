package org.example.venteservice.client;

import org.example.venteservice.dto.external.*;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "livraisonservice", url = "${livraisonservice.url:http://localhost:8083}")
public interface LivraisonClient {
    @PostMapping("/api/deliveries")
    DeliveryResponse createDelivery(@RequestBody DeliveryRequest request);
}