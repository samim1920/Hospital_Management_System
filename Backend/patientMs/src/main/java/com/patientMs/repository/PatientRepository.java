package com.patientMs.repository;

import com.patientMs.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository
        extends JpaRepository<Patient, Long> {

    // Get all patients belonging to a hospital
    List<Patient> findByHospitalId(Long hospitalId);

    // Check duplicate patient ID within the same hospital
    boolean existsByPatientIdAndHospitalId(
            String patientId,
            Long hospitalId
    );
}