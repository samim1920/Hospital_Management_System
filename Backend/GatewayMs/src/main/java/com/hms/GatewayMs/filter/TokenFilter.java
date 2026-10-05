package com.hms.GatewayMs.filter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.HttpMethod;

import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Component
public class TokenFilter
        extends AbstractGatewayFilterFactory<TokenFilter.Config> {

    private static final String SECRET ="907a3856599793670343f5848e9b78238c13d84dddca3ed7c695891cc8255f49aa71f3a44eeff6b443a494ce8c8337648dd3b3132768a1adfbf4c06e0aefd61f";
    private final SecretKey secretKey;

    public TokenFilter() {
        super(Config.class);
;
        this.secretKey = Keys.hmacShaKeyFor(
                SECRET.getBytes(StandardCharsets.UTF_8)
        );
    }

    @Override
    public GatewayFilter apply(Config config) {

        return (exchange, chain) -> {

            String path = exchange.getRequest()
                    .getPath()
                    .toString();


            // =========================================
            // CORS PREFLIGHT
            // =========================================

            if (exchange.getRequest().getMethod()
                    == HttpMethod.OPTIONS) {

                return chain.filter(exchange);
            }


            // =========================================
            // PUBLIC ENDPOINTS
            // =========================================

            if (path.equals("/user/login")
                    || path.equals("/user/register")
                    || path.equals("/user/create")
                    || path.equals("/user/test")) {

                return chain.filter(
                        exchange.mutate()
                                .request(request -> request
                                        .header(
                                                "X-Secret-Key",
                                                "SECRET"
                                        ))
                                .build()
                );
            }


            // =========================================
            // GET AUTHORIZATION HEADER
            // =========================================

            HttpHeaders headers =
                    exchange.getRequest().getHeaders();

            String authHeader =
                    headers.getFirst(
                            HttpHeaders.AUTHORIZATION
                    );

            System.out.println(
                    "Authorization Header = "
                            + authHeader
            );


            // =========================================
            // CHECK BEARER TOKEN
            // =========================================

            if (authHeader == null
                    || !authHeader.startsWith("Bearer ")) {

                return unauthorized(
                        exchange,
                        "Authorization header missing or invalid"
                );
            }


            String token =
                    authHeader.substring(7);


            // =========================================
            // JWT VALIDATION
            // =========================================

            try {

                Claims claims =
                        Jwts.parser()
                                .verifyWith(secretKey)
                                .build()
                                .parseSignedClaims(token)
                                .getPayload();


                System.out.println(
                        "JWT valid for: "
                                + claims.getSubject()
                );


                // =====================================
                // GET HOSPITAL ID FROM JWT
                // =====================================

                Object hospitalIdObject =
                        claims.get("hospitalId");


                if (hospitalIdObject == null) {

                    return unauthorized(
                            exchange,
                            "hospitalId not found in JWT"
                    );
                }


                String hospitalId =
                        String.valueOf(
                                hospitalIdObject
                        );


                System.out.println(
                        "Hospital ID = "
                                + hospitalId
                );


                // =====================================
                // FORWARD REQUEST
                // =====================================

                return chain.filter(
                        exchange.mutate()
                                .request(request ->
                                        request.headers(
                                                httpHeaders -> {

                                                    // Remove any
                                                    // client supplied
                                                    // hospital ID
                                                    httpHeaders.remove(
                                                            "X-Hospital-Id"
                                                    );

                                                    // Add trusted
                                                    // hospital ID
                                                    httpHeaders.add(
                                                            "X-Hospital-Id",
                                                            hospitalId
                                                    );

                                                    // Internal secret
                                                    httpHeaders.remove(
                                                            "X-Secret-Key"
                                                    );

                                                    httpHeaders.add(
                                                            "X-Secret-Key",
                                                            "SECRET"
                                                    );
                                                }
                                        )
                                )
                                .build()
                );


            } catch (Exception e) {

                e.printStackTrace();

                return unauthorized(
                        exchange,
                        "JWT Error: "
                                + e.getMessage()
                );
            }
        };
    }


    // =========================================
    // 401 RESPONSE
    // =========================================

    private reactor.core.publisher.Mono<Void> unauthorized(
            org.springframework.web.server.ServerWebExchange exchange,
            String message) {

        exchange.getResponse()
                .setStatusCode(
                        HttpStatus.UNAUTHORIZED
                );

        exchange.getResponse()
                .getHeaders()
                .setContentType(
                        MediaType.APPLICATION_JSON
                );

        String responseBody =
                "{\"status\":401,\"message\":\""
                        + message.replace(
                        "\"",
                        "\\\""
                )
                        + "\"}";

        byte[] bytes =
                responseBody.getBytes(
                        StandardCharsets.UTF_8
                );

        org.springframework.core.io.buffer.DataBuffer buffer =
                exchange.getResponse()
                        .bufferFactory()
                        .wrap(bytes);

        return exchange.getResponse()
                .writeWith(
                        reactor.core.publisher.Mono.just(
                                buffer
                        )
                );
    }


    public static class Config {
    }
}