package org.example.livraisonservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Map<String, Object> realmAccess = jwt.getClaim("realm_access");

            System.out.println("🔍 [LIVRAISON-SERVICE] JWT Claims: " + jwt.getClaims());
            System.out.println("🔍 [LIVRAISON-SERVICE] Realm Access: " + realmAccess);

            if (realmAccess == null || !realmAccess.containsKey("roles")) {
                System.out.println("❌ [LIVRAISON-SERVICE] Aucun rôle trouvé !");
                return Collections.emptyList();
            }

            Collection<String> roles = (Collection<String>) realmAccess.get("roles");
            System.out.println("✅ [LIVRAISON-SERVICE] Roles extraits: " + roles);

            return roles.stream()
                    .map(role -> {
                        String authority = "ROLE_" + role.toLowerCase();
                        System.out.println("✅ [LIVRAISON-SERVICE] Authority créée: " + authority);
                        return new SimpleGrantedAuthority(authority);
                    })
                    .collect(Collectors.toList());
        });

        return converter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // OPTIONS pour CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Routes protégées
                        .requestMatchers(HttpMethod.GET, "/api/deliveries/**").hasAnyRole("driver", "admin", "respo")
                        .requestMatchers(HttpMethod.POST, "/api/deliveries").hasAnyRole("admin", "respo")
                        .requestMatchers(HttpMethod.PUT, "/api/deliveries/*/status").hasAnyRole("driver", "admin", "respo")
                        .requestMatchers(HttpMethod.PUT, "/api/deliveries/**").hasAnyRole("admin", "respo")

                        .requestMatchers("/api/tracking/**").hasRole("driver")
                        .requestMatchers("/api/incidents/**").hasRole("driver")

                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                );

        return http.build();
    }
}