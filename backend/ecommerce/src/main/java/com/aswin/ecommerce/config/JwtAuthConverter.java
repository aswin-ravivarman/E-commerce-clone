package com.aswin.ecommerce.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Maps JWT "role" claim (single string) to Spring Security authorities (ROLE_ADMIN, ROLE_CUSTOMER).
 */
public final class JwtAuthConverter {

    public static JwtAuthenticationConverter create() {
        Converter<Jwt, Collection<GrantedAuthority>> authoritiesConverter = jwt -> {
            String role = jwt.getClaimAsString("role");
            if (role == null || role.isBlank()) {
                return Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"));
            }
            String authority = "ROLE_" + role.toUpperCase();
            return Stream.of(new SimpleGrantedAuthority(authority)).collect(Collectors.toList());
        };
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);
        return converter;
    }
}
