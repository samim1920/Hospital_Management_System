//package com.hms.user.service;
//
//import com.hms.user.entity.OtpVerification;
//import com.hms.user.repository.OtpVerificationRepository;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.security.SecureRandom;
//import java.time.LocalDateTime;
//
//@Service
//public class OtpService {
//
//    private final OtpVerificationRepository otpRepository;
//    private final EmailService emailService;
//
//    private final SecureRandom random = new SecureRandom();
//
//    public OtpService(
//            OtpVerificationRepository otpRepository,
//            EmailService emailService
//    ) {
//        this.otpRepository = otpRepository;
//        this.emailService = emailService;
//    }
//
//    public void sendOtp(
//            String email,
//            String purpose
//    ) {
//
//        String otp = generateOtp();
//
//        OtpVerification otpVerification =
//                otpRepository
//                        .findByEmailAndPurpose(email, purpose)
//                        .orElse(new OtpVerification());
//
//        otpVerification.setEmail(email);
//        otpVerification.setOtp(otp);
//        otpVerification.setPurpose(purpose);
//        otpVerification.setExpiryTime(
//                LocalDateTime.now().plusMinutes(5)
//        );
//
//        otpRepository.save(otpVerification);
//
//        emailService.sendOtp(email, otp);
//    }
//
//    @Transactional
//    public boolean verifyOtp(
//            String email,
//            String otp,
//            String purpose
//    ) {
//
//        OtpVerification otpVerification =
//                otpRepository
//                        .findByEmailAndPurpose(email, purpose)
//                        .orElseThrow(() ->
//                                new RuntimeException(
//                                        "OTP not found"
//                                )
//                        );
//
//        if (!otpVerification.getOtp().equals(otp)) {
//            return false;
//        }
//
//        if (otpVerification.getExpiryTime()
//                .isBefore(LocalDateTime.now())) {
//            return false;
//        }
//
//        // OTP successfully verified
//        otpRepository.delete(otpVerification);
//
//        return true;
//    }
//
//    private String generateOtp() {
//
//        return String.valueOf(
//                100000 + random.nextInt(900000)
//        );
//    }
//}