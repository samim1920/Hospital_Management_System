package com.example.AppointmentMs.repository;

import com.example.AppointmentMs.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    // =========================
    // GET ALL BY HOSPITAL
    // =========================

    List<Appointment> findByHospitalIdOrderByAppointmentDateAscAppointmentTimeAsc(
            Long hospitalId
    );


    // =========================
    // GET BY ID + HOSPITAL
    // =========================

    Optional<Appointment> findByIdAndHospitalId(
            Long id,
            Long hospitalId
    );


    // =========================
    // PATIENT APPOINTMENTS
    // =========================

    List<Appointment> findByPatientIdAndHospitalIdOrderByAppointmentDateAscAppointmentTimeAsc(
            Long patientId,
            Long hospitalId
    );


    // =========================
    // DOCTOR APPOINTMENTS
    // =========================

    List<Appointment> findByDoctorIdAndHospitalIdOrderByAppointmentDateAscAppointmentTimeAsc(
            Long doctorId,
            Long hospitalId
    );


    // =========================
    // DOCTOR + DATE
    // =========================

    List<Appointment> findByDoctorIdAndAppointmentDateAndHospitalIdOrderByTokenNumberAsc(
            Long doctorId,
            LocalDate appointmentDate,
            Long hospitalId
    );


    // =========================
    // TOKEN GENERATION
    // =========================

    Optional<Appointment> findTopByDoctorIdAndAppointmentDateAndHospitalIdOrderByTokenNumberDesc(
            Long doctorId,
            LocalDate appointmentDate,
            Long hospitalId
    );


    // =========================
    // TOKEN EXISTENCE
    // =========================

    boolean existsByHospitalIdAndAppointmentDateAndTokenNumber(
            Long hospitalId,
            LocalDate appointmentDate,
            Integer tokenNumber
    );
}
