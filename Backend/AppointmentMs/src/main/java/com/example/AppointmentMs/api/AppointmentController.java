package com.example.AppointmentMs.api;

import com.example.AppointmentMs.dto.AppointmentRequestDto;
import com.example.AppointmentMs.dto.AppointmentResponseDto;
import com.example.AppointmentMs.service.AppointmentServiceInterface;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    private final AppointmentServiceInterface appointmentService;

    public AppointmentController(
            AppointmentServiceInterface appointmentService
    ) {
        this.appointmentService = appointmentService;
    }

    // =========================================================
    // CREATE APPOINTMENT
    // POST /appointment/create
    // =========================================================

    @PostMapping("/create")
    public ResponseEntity<AppointmentResponseDto> createAppointment(
            @RequestBody AppointmentRequestDto requestDto,
            @RequestHeader("X-Hospital-Id") Long hospitalId
    ) {

        AppointmentResponseDto response =
                appointmentService.createAppointment(
                        requestDto,
                        hospitalId
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // GET ALL APPOINTMENTS
    // GET /appointment/all
    // =========================================================

    @GetMapping("/all")
    public ResponseEntity<List<AppointmentResponseDto>> getAllAppointments(
            @RequestHeader("X-Hospital-Id") Long hospitalId
    ) {

        return ResponseEntity.ok(
                appointmentService.getAllAppointments(hospitalId)
        );
    }


    // =========================================================
    // GET APPOINTMENT BY ID
    // GET /appointment/{id}
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponseDto> getAppointmentById(
            @PathVariable Long id,
            @RequestHeader("X-Hospital-Id") Long hospitalId
    ) {

        return ResponseEntity.ok(
                appointmentService.getAppointmentById(
                        id,
                        hospitalId
                )
        );
    }


    // =========================================================
    // GET APPOINTMENTS BY PATIENT
    // GET /appointment/patient/{patientId}
    // =========================================================

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointmentsByPatient(
            @PathVariable Long patientId,
            @RequestHeader("X-Hospital-Id") Long hospitalId
    ) {

        return ResponseEntity.ok(
                appointmentService.getAppointmentsByPatient(
                        patientId,
                        hospitalId
                )
        );
    }


    // =========================================================
    // GET APPOINTMENTS BY DOCTOR
    // GET /appointment/doctor/{doctorId}
    // =========================================================

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointmentsByDoctor(
            @PathVariable Long doctorId,
            @RequestHeader("X-Hospital-Id") Long hospitalId
    ) {

        return ResponseEntity.ok(
                appointmentService.getAppointmentsByDoctor(
                        doctorId,
                        hospitalId
                )
        );
    }


    // =========================================================
    // GET DOCTOR APPOINTMENTS BY DATE
    // GET /appointment/doctor/{doctorId}/date/{date}
    // =========================================================

    @GetMapping("/doctor/{doctorId}/date/{date}")
    public ResponseEntity<List<AppointmentResponseDto>> getAppointmentsByDoctorAndDate(
            @PathVariable Long doctorId,
            @PathVariable String date,
            @RequestHeader("X-Hospital-Id") Long hospitalId
    ) {

        LocalDate appointmentDate = LocalDate.parse(date);

        return ResponseEntity.ok(
                appointmentService.getAppointmentsByDoctorAndDate(
                        doctorId,
                        appointmentDate,
                        hospitalId
                )
        );
    }


    // =========================================================
    // UPDATE APPOINTMENT
    // PUT /appointment/{id}
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<AppointmentResponseDto> updateAppointment(
            @PathVariable Long id,
            @RequestBody AppointmentRequestDto requestDto,
            @RequestHeader("X-Hospital-Id") Long hospitalId
    ) {

        return ResponseEntity.ok(
                appointmentService.updateAppointment(
                        id,
                        requestDto,
                        hospitalId
                )
        );
    }


    // =========================================================
    // DELETE APPOINTMENT
    // DELETE /appointment/{id}
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAppointment(
            @PathVariable Long id,
            @RequestHeader("X-Hospital-Id") Long hospitalId
    ) {

        appointmentService.deleteAppointment(
                id,
                hospitalId
        );

        return ResponseEntity.ok(
                "Appointment deleted successfully"
        );
    }


    // =========================================================
    // MARK CASH PAYMENT AS PAID
    // PATCH /appointment/{id}/cash-payment
    // =========================================================

    @PatchMapping("/{id}/cash-payment")
    public ResponseEntity<AppointmentResponseDto> markCashPaymentAsPaid(
            @PathVariable Long id,
            @RequestHeader("X-Hospital-Id") Long hospitalId
    ) {

        return ResponseEntity.ok(
                appointmentService.markCashPaymentAsPaid(
                        id,
                        hospitalId
                )
        );
    }


    // =========================================================
    // VERIFY ONLINE PAYMENT
    // POST /appointment/{id}/payment/verify
    // =========================================================

    @PostMapping("/{id}/payment/verify")
    public ResponseEntity<AppointmentResponseDto> verifyOnlinePayment(
            @PathVariable Long id,
            @RequestBody PaymentVerifyRequest request,
            @RequestHeader("X-Hospital-Id") Long hospitalId
    ) {

        return ResponseEntity.ok(
                appointmentService.verifyOnlinePayment(
                        id,
                        request.getRazorpayOrderId(),
                        request.getRazorpayPaymentId(),
                        request.getRazorpaySignature(),
                        hospitalId
                )
        );
    }


    // =========================================================
    // PAYMENT VERIFY REQUEST DTO
    // =========================================================

    public static class PaymentVerifyRequest {

        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String razorpaySignature;

        public PaymentVerifyRequest() {
        }

        public String getRazorpayOrderId() {
            return razorpayOrderId;
        }

        public void setRazorpayOrderId(String razorpayOrderId) {
            this.razorpayOrderId = razorpayOrderId;
        }

        public String getRazorpayPaymentId() {
            return razorpayPaymentId;
        }

        public void setRazorpayPaymentId(String razorpayPaymentId) {
            this.razorpayPaymentId = razorpayPaymentId;
        }

        public String getRazorpaySignature() {
            return razorpaySignature;
        }

        public void setRazorpaySignature(String razorpaySignature) {
            this.razorpaySignature = razorpaySignature;
        }
    }
}
