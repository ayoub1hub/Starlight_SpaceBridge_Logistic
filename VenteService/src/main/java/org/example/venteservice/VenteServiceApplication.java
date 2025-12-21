package org.example.venteservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class VenteServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(VenteServiceApplication.class, args);
    }
}