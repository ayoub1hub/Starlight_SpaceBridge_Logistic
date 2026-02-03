package org.example.apigateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import reactor.core.publisher.Flux;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
        public CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration config = new CorsConfiguration();

            config.setAllowedOrigins(List.of(
                    "http://localhost:4200",
                    "http://localhost:8080"
            ));

            config.setAllowedMethods(List.of(
                    "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
            ));

            config.setAllowedHeaders(List.of("*"));
            config.setExposedHeaders(List.of("Authorization", "Content-Disposition"));
            config.setAllowCredentials(true);
            config.setMaxAge(3600L);

            UrlBasedCorsConfigurationSource source =
                    new UrlBasedCorsConfigurationSource();
            source.registerCorsConfiguration("/**", config);

            return source;
        }

    @Bean
    public ReactiveJwtAuthenticationConverter jwtAuthenticationConverter() {
        ReactiveJwtAuthenticationConverter converter = new ReactiveJwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Map<String, Object> realmAccess = jwt.getClaim("realm_access");

            // Debug logs
            System.out.println("JWT Claims: " + jwt.getClaims());
            System.out.println("Realm Access: " + realmAccess);

            if (realmAccess == null || !realmAccess.containsKey("roles")) {
                System.out.println("Aucun rôle trouvé !");
                return Flux.empty();
            }

            Collection<String> roles = (Collection<String>) realmAccess.get("roles");
            System.out.println("Roles extraits: " + roles);

            return Flux.fromIterable(roles)
                    .map(role -> {
                        String authority = "ROLE_" + role.toLowerCase();
                        System.out.println("Authority créée: " + authority);
                        return new SimpleGrantedAuthority(authority);
                    })
                    .cast(GrantedAuthority.class);
        });

        return converter;
    }

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchanges -> exchanges
                        // Actuator (pour debug)
                        .pathMatchers("/actuator/**").permitAll()

                        // Public
                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .pathMatchers("/actuator/**").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/warehouses/login").permitAll()

                        // Création livraison
                        .pathMatchers(HttpMethod.POST, "/api/deliveries").hasAnyRole("admin", "respo")

                        // Lecture livraison (IMPORTANT: driver doit pouvoir lire)
                        .pathMatchers(HttpMethod.GET, "/api/deliveries/**").hasAnyRole("driver", "admin", "respo")

                        // Mise à jour statut par livreur
                        .pathMatchers(HttpMethod.PUT, "/api/deliveries/*/status").hasAnyRole("driver", "admin", "respo")

                        // Autres modifications livraison
                        .pathMatchers(HttpMethod.PUT, "/api/deliveries/**").hasAnyRole("admin", "respo")

                        .pathMatchers(HttpMethod.GET, "/api/drivers/**").hasAnyRole("driver", "admin", "respo")

                        .pathMatchers(HttpMethod.PUT, "/api/drivers/**").hasAnyRole("driver", "admin", "respo")

                        // Incidents et tracking
                        .pathMatchers("/api/incidents/**", "/api/tracking/**").hasRole("driver")

                        // Tout le reste
                        .pathMatchers("/api/**").hasAnyRole("admin", "respo")

                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                );

        return http.build();
    }
}