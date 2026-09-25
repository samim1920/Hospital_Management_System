package com.example.AppointmentMs.service;

public interface RazorpayService {

    // =========================================
    // CREATE RAZORPAY ORDER
    // =========================================

    String createOrder(
            Double amount,
            String receipt
    );


    // =========================================
    // VERIFY RAZORPAY PAYMENT SIGNATURE
    // =========================================

    boolean verifyPaymentSignature(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    );
}
