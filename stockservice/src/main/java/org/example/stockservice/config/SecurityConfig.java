package org.example.stockservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // REMOVED: .cors() configuration - handled by CorsConfig instead
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/actuator/**").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                );

        return http.build();
    }

    private Converter<Jwt, org.springframework.security.authentication.AbstractAuthenticationToken> jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());
        return converter;
    }

    private static class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {
        @Override
        public Collection<GrantedAuthority> convert(Jwt jwt) {
            System.out.println("=".repeat(80));
            System.out.println("🔐 STOCK SERVICE - JWT Processing");
            System.out.println("📧 Subject: " + jwt.getSubject());
            System.out.println("🎫 Token ID: " + jwt.getId());

            Collection<GrantedAuthority> authorities = new ArrayList<>();

            // Extract realm roles
            Map<String, Object> realmAccess = jwt.getClaim("realm_access");
            System.out.println("🔍 Realm Access: " + realmAccess);

            if (realmAccess != null && realmAccess.get("roles") != null) {
                @SuppressWarnings("unchecked")
                List<String> realmRoles = (List<String>) realmAccess.get("roles");
                System.out.println("✅ Realm Roles: " + realmRoles);

                authorities.addAll(realmRoles.stream()
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(Collectors.toList()));
            }

            // Extract resource/client roles
            Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
            if (resourceAccess != null) {
                resourceAccess.forEach((resource, access) -> {
                    if (access instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> accessMap = (Map<String, Object>) access;
                        if (accessMap.get("roles") != null) {
                            @SuppressWarnings("unchecked")
                            List<String> clientRoles = (List<String>) accessMap.get("roles");
                            authorities.addAll(clientRoles.stream()
                                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                                    .collect(Collectors.toList()));
                        }
                    }
                });
            }

            // Extract scopes
            String scopes = jwt.getClaimAsString("scope");
            if (scopes != null && !scopes.isEmpty()) {
                for (String scope : scopes.split(" ")) {
                    authorities.add(new SimpleGrantedAuthority("SCOPE_" + scope));
                }
            }

            System.out.println("🎭 Final Authorities: " + authorities);
            System.out.println("=".repeat(80));

            return authorities;
        }
    }
}