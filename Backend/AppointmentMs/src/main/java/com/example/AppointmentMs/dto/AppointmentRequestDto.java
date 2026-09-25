package com.example.AppointmentMs.dto;

import com.example.AppointmentMs.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentRequestDto {

    // =========================
    // PATIENT
    // =========================

    private Long patientId;

    private String patientName;


    // =========================
    // DOCTOR
    // =========================

    private Long doctorId;


    // =========================
    // APPOINTMENT
    // =========================

    private LocalDate appointmentDate;

    private LocalTime appointmentTime;

    private String reason;


    // =========================
    // PAYMENT
    // =========================

    private Appointment.PaymentMethod paymentMethod;


    // =========================
    // CONSTRUCTORS
    // =========================

    public AppointmentRequestDto() {
    }


    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(LocalTime appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Appointment.PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(Appointment.PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}