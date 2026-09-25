package com.hms.user.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final long JWT_TOKEN_VALIDITY = 10 * 60 * 1000L;

    private static final String SECRET =
            "907a3856599793670343f5848e9b78238c13d84dddca3ed7c695891cc8255f49aa71f3a44eeff6b443a494ce8c8337648dd3b3132768a1adfbf4c06e0aefd61f";

    private final SecretKey secretKey =
            Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));

    public String generateToken(UserDetails userDetails) {

        Map<String, Object> claims = new HashMap<>();

        CoustomUserDetails user = (CoustomUserDetails) userDetails;

        claims.put("hospitalId", user.getId());
        claims.put("username", user.getUsername());
        claims.put("name", user.getName());
        claims.put("email", user.getEmail());

        return doGenerateToken(claims, user.getUsername());
    }

    private String doGenerateToken(
            Map<String, Object> claims,
            String subject
    ) {

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + JWT_TOKEN_VALIDITY
                        )
                )
                .signWith(secretKey)
                .compact();
    }
}