package org.example.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeExchange(exchanges -> exchanges
                        // public pour login entrepôt (web et mobile si besoin)
                        .pathMatchers(HttpMethod.POST, "/api/warehouses/login").permitAll()

                        // pour livreurs (mobile)
                        .pathMatchers("/api/tracking/**", "/api/incidents/**", "/api/deliveries/**")
                        .hasAuthority("ROLE_driver")

                        // pour admin et respo (web)
                        .pathMatchers("/api/**").hasAnyAuthority("admin", "respo")

                        // reste authentifié
                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }
}