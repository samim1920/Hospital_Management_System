package com.PatientMs.PatientMs.service;

import com.patientMs.dto.PatientRequestDto;
import com.patientMs.dto.PatientResponseDto;

import java.util.List;

public interface PatientServiceInterface {

    // Create patient
    PatientResponseDto createPatient(
            PatientRequestDto patientRequestDto,
            Long hospitalId
    );

    // Get single patient
    PatientResponseDto getPatientById(
            Long id,
            Long hospitalId
    );

    // Get all patients of logged-in hospital
    List<PatientResponseDto> getAllPatients(
            Long hospitalId
    );

    // Update patient
    PatientResponseDto updatePatient(
            Long id,
            PatientRequestDto patientRequestDto,
            Long hospitalId
    );

    // Delete patient
    void deletePatient(
            Long id,
            Long hospitalId
    );
}