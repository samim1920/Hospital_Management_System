package com.example.AppointmentMs.service;

import com.example.AppointmentMs.dto.AppointmentRequestDto;
import com.example.AppointmentMs.dto.AppointmentResponseDto;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentServiceInterface {

    // =========================
    // CREATE APPOINTMENT
    // =========================

    AppointmentResponseDto createAppointment(
            AppointmentRequestDto requestDto,
            Long hospitalId
    );


    // =========================
    // GET ALL APPOINTMENTS
    // =========================

    List<AppointmentResponseDto> getAllAppointments(
            Long hospitalId
    );


    // =========================
    // GET APPOINTMENT BY ID
    // =========================

    AppointmentResponseDto getAppointmentById(
            Long id,
            Long hospitalId
    );


    // =========================
    // GET PATIENT APPOINTMENTS
    // =========================

    List<AppointmentResponseDto> getAppointmentsByPatient(
            Long patientId,
            Long hospitalId
    );


    // =========================
    // GET DOCTOR APPOINTMENTS
    // =========================

    List<AppointmentResponseDto> getAppointmentsByDoctor(
            Long doctorId,
            Long hospitalId
    );


    // =========================
    // GET DOCTOR APPOINTMENTS BY DATE
    // =========================

    List<AppointmentResponseDto> getAppointmentsByDoctorAndDate(
            Long doctorId,
            LocalDate date,
            Long hospitalId
    );


    // =========================
    // UPDATE APPOINTMENT
    // =========================

    AppointmentResponseDto updateAppointment(
            Long id,
            AppointmentRequestDto requestDto,
            Long hospitalId
    );


    // =========================
    // DELETE APPOINTMENT
    // =========================

    void deleteAppointment(
            Long id,
            Long hospitalId
    );


    // =========================
    // MARK CASH PAYMENT AS PAID
    // =========================

    AppointmentResponseDto markCashPaymentAsPaid(
            Long id,
            Long hospitalId
    );


    // =========================
    // RAZORPAY PAYMENT VERIFICATION
    // =========================

    AppointmentResponseDto verifyOnlinePayment(
            Long appointmentId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature,
            Long hospitalId
    );
}
