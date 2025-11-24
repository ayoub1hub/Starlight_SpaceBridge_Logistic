package org.example.comptabiliteservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class ComptabiliteserviceApplication {

    public static void main(String[] args) {
        SpringApplication.run(ComptabiliteserviceApplication.class, args);
    }

}
