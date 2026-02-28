package com.aswin.ecommerce.service;

import com.aswin.ecommerce.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final long expirationMs;

    public JwtService(
            JwtEncoder jwtEncoder,
            @Value("${app.jwt.expiration-ms}") long expirationMs
    ) {
        this.jwtEncoder = jwtEncoder;
        this.expirationMs = expirationMs;
    }

    public String generateToken(User user) {
        return generateToken(user.getEmail(), user.getId(), user.getUsername(), user.getRole());
    }

    public String generateToken(String email, Long userId, String username) {
        return generateToken(email, userId, username, "CUSTOMER");
    }

    public String generateToken(String email, Long userId, String username, String role) {
        Instant now = Instant.now();
        String safeRole = (role != null && role.equalsIgnoreCase("ADMIN")) ? "ADMIN" : "CUSTOMER";

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("ecommerce-api")
                .issuedAt(now)
                .expiresAt(now.plusMillis(expirationMs))
                .subject(email)
                .claim("uid", userId)
                .claim("username", username)
                .claim("role", safeRole)
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}

