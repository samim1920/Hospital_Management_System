package com.hms.user.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class EmailApiService {

    @Value("${resend.api.key}")
    private String apiKey;

    @Value("${app.mail.from}")
    private String from;

    private final RestTemplate restTemplate =
            new RestTemplate();

    public void sendOtp(String to, String otp) {

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
                "from", from,
                "to", List.of(to),
                "subject", "Hospital Management System - OTP",
                "html",
                "<h2>Email Verification</h2>" +
                        "<p>Your OTP is: <strong>" + otp +
                        "</strong></p>" +
                        "<p>This OTP is confidential. Do not share it.</p>"
        );

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        restTemplate.postForEntity(
                "https://api.resend.com/emails",
                request,
                String.class
        );
    }
}
