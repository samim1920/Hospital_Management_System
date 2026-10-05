//package com.hms.user.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "pending_registrations")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class PendingRegistration {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String hospitalName;
//
//    private String adminName;
//
//    @Column(unique = true, nullable = false)
//    private String email;
//
//    private String phone;
//
//    private String password;
//
//    private String otp;
//
//    private LocalDateTime otpExpiry;
//}