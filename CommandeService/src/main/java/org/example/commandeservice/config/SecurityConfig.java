package org.example.commandeservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Désactive CSRF (utile pour les APIs REST)
                .csrf(csrf -> csrf.disable())

                // Pas de session côté serveur, JWT stateless
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Définition des routes et rôles
                .authorizeHttpRequests(authz -> authz
                        // Login ouvert pour le microservice concerné
                        .requestMatchers("/api/{microservice}/login").permitAll()

                        // Exemple pour livraisons
                        .requestMatchers("/api/deliveries").hasAnyRole("admin", "respo")
                        .requestMatchers("/api/deliveries/**").hasAnyRole("driver", "admin", "respo")

                        // Routes génériques pour incidents / tracking
                        .requestMatchers("/api/incidents/**", "/api/tracking/**").hasRole("driver")

                        // Toutes les autres routes API
                        .requestMatchers("/api/**").hasAnyRole("admin", "respo")

                        .anyRequest().authenticated()
                )

                // Config JWT
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
                );

        return http.build();
    }

    /**
     * Converter pour transformer le claim realm_access.roles en GrantedAuthority
     */
    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        var jwtGrantedAuthoritiesConverter =
                new org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter();

        jwtGrantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");
        jwtGrantedAuthoritiesConverter.setAuthoritiesClaimName("realm_access.roles");

        var jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }
}
