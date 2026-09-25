package com.example.AppointmentMs.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class RazorpayServiceImpl implements RazorpayService {

    private final RazorpayClient razorpayClient;

    public RazorpayServiceImpl(RazorpayClient razorpayClient) {
        this.razorpayClient = razorpayClient;
    }

    // =========================================================
    // CREATE RAZORPAY ORDER
    // =========================================================

    @Override
    public String createOrder(
            Double amount,
            String receipt
    ) {

        try {

            if (amount == null || amount <= 0) {
                throw new RuntimeException(
                        "Payment amount must be greater than zero"
                );
            }

            // Razorpay expects amount in paise.
            // Example:
            // ₹500 = 50000 paise
            long amountInPaise = Math.round(amount * 100);

            JSONObject orderRequest = new JSONObject();

            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", receipt);
            orderRequest.put("payment_capture", 1);

            Order order = razorpayClient.orders.create(orderRequest);

            String orderId = order.get("id");

            if (orderId == null || orderId.isBlank()) {
                throw new RuntimeException(
                        "Razorpay order ID was not returned"
                );
            }

            return orderId;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to create Razorpay order",
                    e
            );
        }
    }


    // =========================================================
    // VERIFY PAYMENT SIGNATURE
    // =========================================================

    @Override
    public boolean verifyPaymentSignature(
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    ) {

        try {

            if (razorpayOrderId == null ||
                    razorpayOrderId.isBlank()) {

                throw new RuntimeException(
                        "Razorpay Order ID is required"
                );
            }

            if (razorpayPaymentId == null ||
                    razorpayPaymentId.isBlank()) {

                throw new RuntimeException(
                        "Razorpay Payment ID is required"
                );
            }

            if (razorpaySignature == null ||
                    razorpaySignature.isBlank()) {

                throw new RuntimeException(
                        "Razorpay Signature is required"
                );
            }


            JSONObject paymentData = new JSONObject();

            paymentData.put(
                    "razorpay_order_id",
                    razorpayOrderId
            );

            paymentData.put(
                    "razorpay_payment_id",
                    razorpayPaymentId
            );

            paymentData.put(
                    "razorpay_signature",
                    razorpaySignature
            );


            return Utils.verifyPaymentSignature(
                    paymentData,
                    getKeySecret()
            );

        } catch (Exception e) {

            return false;
        }
    }


    // =========================================================
    // GET RAZORPAY SECRET
    // =========================================================

    private String getKeySecret() {

        /*
         * We should NOT expose the Razorpay secret.
         *
         * This method will be replaced with a proper
         * configuration-based secret injection.
         */

        return System.getProperty(
                "razorpay.key.secret"
        );
    }
}