package com.patientMs.service;

import com.patientMs.dto.PatientRequestDto;
import com.patientMs.dto.PatientResponseDto;
import com.patientMs.entity.Patient;
import com.patientMs.repository.PatientRepository;
import org.springframework.stereotype.Service;
import com.PatientMs.PatientMs.service.PatientServiceInterface;



import java.util.List;

@Service
public class PatientServiceImplements implements PatientServiceInterface {

    private final PatientRepository patientRepository;

    public PatientServiceImplements(
            PatientRepository patientRepository
    ) {
        this.patientRepository = patientRepository;
    }

    // =========================
    // CREATE PATIENT
    // =========================

    @Override
    public PatientResponseDto createPatient(
            PatientRequestDto patientRequestDto,
            Long hospitalId
    ) {

        // Check duplicate patient ID in same hospital
        if (patientRepository.existsByPatientIdAndHospitalId(
                patientRequestDto.getPatientId(),
                hospitalId
        )) {

            throw new RuntimeException(
                    "Patient ID "
                            + patientRequestDto.getPatientId()
                            + " is already registered in this hospital"
            );
        }

        Patient patient = new Patient();

        patient.setPatientId(
                patientRequestDto.getPatientId()
        );

        patient.setName(
                patientRequestDto.getName()
        );

        patient.setAge(
                patientRequestDto.getAge()
        );

        patient.setGender(
                patientRequestDto.getGender()
        );

        patient.setPhone(
                patientRequestDto.getPhone()
        );

        patient.setDepartment(
                patientRequestDto.getDepartment()
        );

        patient.setStatus(
                patientRequestDto.getStatus()
        );

        patient.setHospitalId(hospitalId);

        Patient savedPatient =
                patientRepository.save(patient);

        return convertToResponseDto(savedPatient);
    }


    // =========================
    // GET PATIENT BY ID
    // =========================

    @Override
    public PatientResponseDto getPatientById(
            Long id,
            Long hospitalId
    ) {

        Patient patient =
                patientRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient not found with id: "
                                                + id
                                )
                        );

        // Hospital security check
        if (!patient.getHospitalId().equals(hospitalId)) {
            throw new RuntimeException(
                    "You cannot access this patient"
            );
        }

        return convertToResponseDto(patient);
    }


    // =========================
    // GET ALL PATIENTS
    // =========================

    @Override
    public List<PatientResponseDto> getAllPatients(
            Long hospitalId
    ) {

        return patientRepository
                .findByHospitalId(hospitalId)
                .stream()
                .map(this::convertToResponseDto)
                .toList();
    }


    // =========================
    // UPDATE PATIENT
    // =========================

    @Override
    public PatientResponseDto updatePatient(
            Long id,
            PatientRequestDto patientRequestDto,
            Long hospitalId
    ) {

        Patient patient =
                patientRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient not found with id: "
                                                + id
                                )
                        );

        // Hospital security check
        if (!patient.getHospitalId().equals(hospitalId)) {
            throw new RuntimeException(
                    "You cannot update this patient"
            );
        }

        // Check if patient ID is being changed
        if (!patient.getPatientId().equals(
                patientRequestDto.getPatientId()
        )) {

            if (patientRepository
                    .existsByPatientIdAndHospitalId(
                            patientRequestDto.getPatientId(),
                            hospitalId
                    )) {

                throw new RuntimeException(
                        "Patient ID "
                                + patientRequestDto.getPatientId()
                                + " is already registered in this hospital"
                );
            }
        }

        patient.setPatientId(
                patientRequestDto.getPatientId()
        );

        patient.setName(
                patientRequestDto.getName()
        );

        patient.setAge(
                patientRequestDto.getAge()
        );

        patient.setGender(
                patientRequestDto.getGender()
        );

        patient.setPhone(
                patientRequestDto.getPhone()
        );

        patient.setDepartment(
                patientRequestDto.getDepartment()
        );

        patient.setStatus(
                patientRequestDto.getStatus()
        );

        Patient updatedPatient =
                patientRepository.save(patient);

        return convertToResponseDto(updatedPatient);
    }


    // =========================
    // DELETE PATIENT
    // =========================

    @Override
    public void deletePatient(
            Long id,
            Long hospitalId
    ) {

        Patient patient =
                patientRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Patient not found with id: "
                                                + id
                                )
                        );

        // Hospital security check
        if (!patient.getHospitalId().equals(hospitalId)) {
            throw new RuntimeException(
                    "You cannot delete this patient"
            );
        }

        patientRepository.delete(patient);
    }


    // =========================
    // CONVERT ENTITY → DTO
    // =========================

    private PatientResponseDto convertToResponseDto(
            Patient patient
    ) {

        PatientResponseDto responseDto =
                new PatientResponseDto();

        responseDto.setId(
                patient.getId()
        );

        responseDto.setPatientId(
                patient.getPatientId()
        );

        responseDto.setName(
                patient.getName()
        );

        responseDto.setAge(
                patient.getAge()
        );

        responseDto.setGender(
                patient.getGender()
        );

        responseDto.setPhone(
                patient.getPhone()
        );

        responseDto.setDepartment(
                patient.getDepartment()
        );

        responseDto.setStatus(
                patient.getStatus()
        );

        return responseDto;
    }
}
