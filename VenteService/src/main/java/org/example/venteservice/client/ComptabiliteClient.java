package org.example.venteservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.UUID;

@FeignClient(name = "comptabiliteservice", url = "${comptabiliteservice.url}")
public interface ComptabiliteClient {

    @PostMapping("/api/invoices/from-sale/{saleId}")
    ResponseEntity<?> createInvoiceFromSale(@PathVariable("saleId") UUID saleId);
}