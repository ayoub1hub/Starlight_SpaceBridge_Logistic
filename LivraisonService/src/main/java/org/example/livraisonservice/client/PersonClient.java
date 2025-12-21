package org.example.livraisonservice.client;

import org.example.livraisonservice.dto.external.PersonDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.UUID;

@FeignClient(name = "stock-service", url = "${stock-service.url:http://localhost:8084}")
public interface PersonClient {

    @GetMapping("/api/persons/{id}")
    PersonDto getPersonById(@PathVariable("id") UUID id);
}