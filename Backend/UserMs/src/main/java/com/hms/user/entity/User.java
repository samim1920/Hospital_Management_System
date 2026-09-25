package com.hms.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String hospitalName;

  private String adminName;

  @Column(unique = true, nullable = false)
  private String email;

  private String phone;

  @Column(nullable = false)
  private String password;

  private boolean emailVerified;

  private String otp;

  private LocalDateTime otpExpiry;
}