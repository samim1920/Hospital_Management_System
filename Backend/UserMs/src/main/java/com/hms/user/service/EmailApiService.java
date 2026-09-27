package com.hms.user.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailApiService {

    private final JavaMailSender mailSender;

    public EmailApiService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String to, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(to);
        message.setSubject("Hospital Management System - OTP");

        message.setText(
                "Email Verification\n\n" +
                        "Your OTP is: " + otp + "\n\n" +
                        "This OTP is confidential. Do not share it."
        );

        mailSender.send(message);
    }
}